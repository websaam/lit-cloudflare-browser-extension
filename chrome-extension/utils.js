// 
// turn blob data to data URI
// @param { Blob } blob 
// @return { Promise<String> } blob data in data URI
// 
async function blobToDataURI(blob){
    return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = (e) => {
            var data = e.target.result;
            resolve(data);
        };
        reader.readAsDataURL(blob);
    });
}