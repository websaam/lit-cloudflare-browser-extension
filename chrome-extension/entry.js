// 
// This file is the entry point of the browser extension
// global variables:
// - window.videoId
// - window.embedContainerExist
// - window.onLink
// - window.litNetworkReady
//

// ----------------------------- Entry -----------------------------
(async () => {
    console.log("🔥 Lit-Cloudflare Plugin 1.0.1");
    
    // connent to Lit Node Client
    var litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect()
    window.litNodeClient = litNodeClient

    // listen when the network is fully connected:
    document.addEventListener('lit-ready', async function (e) {
        window.litNetworkReady = true;
        console.log('🔥 LIT network is ready');
    }, false);

    // upon leave the page
    window.onbeforeunload = function () {
        localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
        localStorage.removeItem('data-lit');
        localStorage.removeItem('readableConditions');
        localStorage.removeItem('walletconnect');
        // localStorage.removeItem('lit-auth-signature');
        // localStorage.removeItem('lit-comms-keypair');
     }

    injectShareModalToBody();
    
    whileOnTheRightLink(() => {
        window.onLink = true;
        manipulateDom();
    }, () => {
        window.onLink = false;
        window.embedContainerExist = false;
    }, 1000);
})();

// ----------------------------- Methods -----------------------------
//
// We are trying to find the video id under the label "Video ID"
// @param { String } tag - a tag could be a div for <div>, label for <label>
// @param { String } text - the text inside the tag eg. <label>this text</label>
// @returns { Array } an array of found elements
//
function getElementsByTagText(tag, text){
    return [...document.querySelectorAll(tag)]
       .filter(e => e.textContent.includes(text));
}

// 
// listen to the tabs Settings, Captions, Embed, JSON
// @params { Function } callback - a function to pass in when the "Embed" button is clicked
// @returns { void }
//
function onClickedEmbedTab(callback){

    var tabBtns = document.querySelectorAll('[role="tab"]');
    [...tabBtns].forEach((btn) => {

        const isEmbedBtn = btn.getAttribute('aria-controls') == 'embed';

        // ammend the tab text if it's the embed tab
        btn.innerText = isEmbedBtn ? 'Embed (Powered Up by 🔥 LitProtocol)' : btn.innerText;

        // when a tab is clicked
        btn.addEventListener('click', (e) => {

            var container = document.getElementsByClassName('lit-embed-container');

            // when is the embed tab
            if(isEmbedBtn){
                window.hidedEmbedContainer = false;
                if(container.length > 0){
                    container[0].style.display = 'unset';
                }
                callback();
                return;
            }

            // when other tabs
            window.hidedEmbedContainer = true;
            if(container.length > 0){
                container[0].style.display = 'none';
            }
        });

    });
}

//
// Add the Lit section into the DOM
// @returns { void }
// 
function setupLitEmbedContainerDom(){

    // -- prepare data
    const template = `
        <div id="btn-lit-gate-video">🔥 Token-gate this video </div>
        <pre id="lit-snippet"></pre>
        <span class="lit-btn-copy">Click to copy</span>
        <label>Place the following script tags at the end of the body tag</label>
        <pre id="lit-js-snippet"></pre>
        <span class="lit-btn-copy">Click to copy</span>
    `

    const scriptSrc = 'https://litcdn.wzac.io/0.0.1/lit-unlock.min.js';
    const styleSrc = 'https://litcdn.wzac.io/0.0.1/lit-unlock.min.css';

    // -- execute
    window.embedContainerExist = true;
    var tabPanel = document.querySelector('[role="tabpanel"]');

    var litEmbedContainer = document.createElement('div');
    litEmbedContainer.classList.add('lit-embed-container');
    litEmbedContainer.innerHTML = template;
    tabPanel.prepend(litEmbedContainer);

    // -- add listeners
    var btnGate = document.getElementById('btn-lit-gate-video');
    btnGate.addEventListener('click', (e) => {
        setAccessControlConditions();
    });

    var btnsCopy = document.getElementsByClassName('lit-btn-copy');
    [...btnsCopy].forEach((btn) => {
        btn.addEventListener('click', () => {
            const snippet = btn.previousElementSibling.innerText;
            navigator.clipboard.writeText(snippet).then(() => {
            console.log('Async: Copying to clipboard was successful!');

                btn.innerText = 'Copied text to clipboard';

                setTimeout(() => {
                    btn.innerText = 'Click to copy';
                }, 2000);

            }, (err) => {
                console.error('Async: Could not copy text: ', err);
            });
        });
    });

    // -- add js script tags to snippet
    document.getElementById('lit-js-snippet').innerText = `
<script onload="LitJsSdk.litJsSdkLoadedInALIT()" src="https://jscdn.litgateway.com/index.web.js"></script>
<script src="${scriptSrc}"></script>
<link rel="stylesheet" href="${styleSrc}"></link>
    `
}

// 
// Inject the accessControlConditions modal tag after the <body> tag
// @returns { void }
//
function injectShareModalToBody(){
    var model = document.createElement('div');
    model.setAttribute('id', 'shareModal');
    document.body.prepend(model);
}

//
// Check if we are on the right URL 
// url has to match the following format
// https://dash.cloudflare.com/.../stream/videos/...
// @returns { void }
//
function whileOnTheRightLink(callbackValid, callbackInvalid, interval){
    setInterval(() => {
        var currentPath = window.location.href;
        var re = new RegExp("^https:\/\/dash.cloudflare.com\/[a-z0-9]*\/stream\/videos\/[a-z0-9]*$");
        if (re.test(currentPath)) {
            callbackValid();
        } else {
            callbackInvalid();
        }
    }, interval);
}

//
// Look for the video id and setup dom
// when embed tab is clicked
// @returns { void }
//
function manipulateDom(){
    var videoIdLabel = getElementsByTagText('label', 'Video ID')[0];
    let videoId;

    if(videoIdLabel != undefined){
        videoId = videoIdLabel.nextElementSibling.querySelector('pre').innerText;
    }

    if(videoIdLabel != undefined && videoId.length > 1){
        console.log("Found Video Label ID");
        window.videoId = videoId;
        console.log(window.videoId);
        onClickedEmbedTab(async () => {

            // If we are on the right link
            // and when our container is not embeded yet
            if(!window.embedContainerExist && window.onLink){
                setupLitEmbedContainerDom();
            }
        });
    }
}