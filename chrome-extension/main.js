// 
// global variables:
// - window.videoId

//
// We are trying to find the video id under the label "Video ID"
//
function getElementByTagText(tag, text){
    var element;
    [...document.querySelectorAll(tag)]
       .filter(e => e.textContent.includes(text))
       .forEach(e => element = e);
    return element;
}

// 
// listen to the tabs Settings, Captions, Embed, JSON
//
function onClickedEmbedTab(callback){
    var tabBtns = document.querySelectorAll('[role="tab"]');
    [...tabBtns].forEach((btn) => {
        if(btn.getAttribute('aria-controls') == 'embed'){
            btn.innerText += ' (Powered Up by 🔥 LitProtocol)';

            btn.addEventListener('click', (e) => {
                window.hidedEmbedContainer = false;
                var container = document.getElementsByClassName('lit-embed-container');
                if(container.length > 0){
                    container[0].style.display = 'unset';
                }
                callback();
            });
        }else{
            btn.addEventListener('click', (e) => {
                window.hidedEmbedContainer = true;
                var container = document.getElementsByClassName('lit-embed-container');
                if(container.length > 0){
                    container[0].style.display = 'none';
                }
            });
        }
    });
}

function setupLitEmbedContainerDom(){
    window.addedEmbedContainer = true;
    var tabPanel = document.querySelector('[role="tabpanel"]');

    var litEmbedContainer = document.createElement('div');
    litEmbedContainer.classList.add('lit-embed-container');
    litEmbedContainer.innerHTML = `
    <div id="btn-lit-gate-video">🔥 Token-gate this video </div>
    `;
    tabPanel.prepend(litEmbedContainer);

    var btnGate = document.getElementById('btn-lit-gate-video');
    btnGate.addEventListener('click', (e) => {
        setAccessControlConditions();
    });

    // inject code snippet area
    var pre = document.createElement('pre');
    pre.setAttribute('id', 'lit-snippet');
    tabPanel.append(pre);

    // inject js snippet description
    var jsPreLabel = document.createElement('label');
    jsPreLabel.innerText = 'Place the following script tags at the end of the body tag';
    tabPanel.appendChild(jsPreLabel);

    // inject script tab snippet here
    var jsPre = document.createElement('pre');
    jsPre.setAttribute('id', 'lit-js-snippet');
    jsPre.innerText = `
<script onload="LitJsSdk.litJsSdkLoadedInALIT()"src="https://jscdn.litgateway.com/index.web.js"></script>
<script src="https://files-ruddy-ten.vercel.app/"></script>
    `;
    tabPanel.append(jsPre);
}

function injectShareModel(){
    var model = document.createElement('div');
    model.setAttribute('id', 'shareModal');
    document.body.prepend(model);
}

(async () => {
    console.log("🔥 Lit-Cloudflare Plugin 0.0.1");
    
    // connent to Lit Node Client
    var litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect()
    window.litNodeClient = litNodeClient

    // listen when the network is fully connected:
    document.addEventListener('lit-ready', async function (e) {
        console.log('🔥 LIT network is ready')
    }, false);

    injectShareModel();
    
    var videoLabelExist = setInterval(() => {
        var videoIdLabel = getElementByTagText('label', 'Video ID');
        let videoId;

        if(videoIdLabel != undefined){
            videoId = videoIdLabel.nextElementSibling.querySelector('pre').innerText;
        }

        if(videoIdLabel != undefined && videoId.length > 1){
            console.log("Found Video Label ID");
            window.videoId = videoId;
            console.log(window.videoId);
            onClickedEmbedTab(async () => {
                if(!window.addedEmbedContainer){
                    setupLitEmbedContainerDom();
                }
            });
            clearInterval(videoLabelExist);
        }
    }, 100);
})();