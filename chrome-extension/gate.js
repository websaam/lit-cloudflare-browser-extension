async function setAccessControlConditions(){

    // -- prepare params
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: 'ethereum'});

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
    const chain = 'ethereum';

    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain});

    const accessControlConditions = JSON.parse(atob(localStorage['accessControlConditions']));

    const videoId = window.videoId;

    const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(videoId);

    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
        accessControlConditions, // array of objects [{}]
        symmetricKey, // Unit8Array string
        authSig, // object
        chain, // string
    });

    const encryptedZip_dataURI = await blobToDataURI(encryptedZip);

    localStorage['data-lit'] = btoa(JSON.stringify({
        accessControlConditions: localStorage['accessControlConditions'],
        encryptedZip:  encryptedZip_dataURI,
        encryptedSymmetricKey: btoa(encryptedSymmetricKey),
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
        data-lit="${localStorage['data-lit']}">
    </iframe>
    <button class="btn-lit-video-unlock">Unlock</button>
</div>`;

}
