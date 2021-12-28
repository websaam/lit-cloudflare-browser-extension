async function setAccessControlConditions(){

    // -- prepare params
    await LitJsSdk.checkAndSignAuthMessage({chain: 'ethereum'});
    openShareModal();
}


// 
// Open Access Controls model
//
function openShareModal() {
    console.log("open share modal");
    ACCM.ReactContentRenderer.render(
    ACCM.ShareModal,
    // props to be passed to the ShareModal component.  These are documented here: https://github.com/LIT-Protocol/lit-access-control-conditions-modal#props
    {
        sharingItems: [],
        onAccessControlConditionsSelected: async function (accessControlConditions) {
            console.log(
                "accessControlConditions from ShareModal: ",
                accessControlConditions
            );
            localStorage['accessControlConditions'] = btoa(JSON.stringify(accessControlConditions));

            const readableConditions = await LitJsSdk.humanizeAccessControlConditions({
                accessControlConditions,
            });

            localStorage['readableConditions'] = readableConditions;

            ACCM.ReactContentRenderer.unmount(document.getElementById("shareModal"));
            await encryptVideoId();
            await generateSnippet();
        },
        onClose: () => {
            console.log("close share modal"), ACCM.ReactContentRenderer.unmount(document.getElementById("shareModal"));
        },
        getSharingLink: function (sharingItem) {
            console.log("getSharingLink", sharingItem);
            return "";
        },
        showStep: "ableToAccess",
    },
    // target DOM node
    document.getElementById("shareModal")
    );
}

async function encryptVideoId(){
                
    // -- prepare params

    const baseUrl = 'cf-worker.gtc-lightanson.workers.dev';

    const chain = 'ethereum';

    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain});

    const accessControlConditions = JSON.parse(atob(localStorage['accessControlConditions']));

    const videoId = window.videoId;

    const resourceId = {
        baseUrl,
        path: `/${videoId}`,
        orgId: "",
        role: "",
        extraData: ""
    }

    await litNodeClient.saveSigningCondition({
        accessControlConditions, 
        chain, 
        authSig, 
        resourceId 
    })

    const resourceId_base64 = btoa(JSON.stringify(resourceId));

    localStorage['data-lit'] = btoa(JSON.stringify({
        accessControlConditions: localStorage['accessControlConditions'],
        resourceId_base64
    }));
    localStorage.removeItem('accessControlConditions');    
}

//
// Creator:: Generate Snippet
//
async function generateSnippet(){
    var e = document.getElementById('lit-snippet');

    e.innerText = `<div class="lit-video-wrapper">
    <iframe 
        src=""
        class="lit-video"
        allow="accelerometer; gyroscope; 
        autoplay; encrypted-media; 
        picture-in-picture;" 
        allowfullscreen="true"
        data-readable-conditions="${localStorage['readableConditions']}"
        data-lit="${localStorage['data-lit']}">
    </iframe>
    <button class="btn-lit-video-unlock">🔥  Unlock with Lit-Protocol</button>
</div>`;

}
