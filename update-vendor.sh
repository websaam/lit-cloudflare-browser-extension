#!/bin/sh

cd ./chrome-extension/vendors/jscdn.litgateway.com
rm index.web.js
wget https://jscdn.litgateway.com/index.web.js

cd ../lit-access-control-conditions-modal-vanilla-js
rm index.js
rm main.css
wget https://raw.githubusercontent.com/LIT-Protocol/lit-access-control-conditions-modal-vanilla-js/main/dist/index.js
wget https://raw.githubusercontent.com/LIT-Protocol/lit-access-control-conditions-modal-vanilla-js/main/dist/main.css