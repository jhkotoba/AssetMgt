import { constant } from "/script/common/common.js";
import { postFetch } from "/script/common/fetch.js";

const crypt = new JSEncrypt();
window.addEventListener("DOMContentLoaded", event => {
   
    // 암호화 공개키 세팅
	crypt.setPublicKey(constant.aes256.publicKey);

    
});
