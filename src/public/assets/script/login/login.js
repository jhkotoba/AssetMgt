import { constant } from "/script/common/common.js";
import { postFetch } from "/script/common/fetch.js";

const crypt = new JSEncrypt();
window.addEventListener("DOMContentLoaded", event => {
   
    // 암호화 공개키 세팅
	crypt.setPublicKey(constant.aes256.publicKey);

    // 로그인 버튼
	login.addEventListener('click', loginProcess);
	password.addEventListener('keyup', event => event.keyCode === 13 ? loginProcess(event) : null)
});

/**
 * 로그인 처리
 */
 async function loginProcess(){
	let userId = crypt.encrypt(document.getElementById("userId").value);
	let password = crypt.encrypt(document.getElementById("password").value);
	
	// 로그인 처리
	let loginRes = await postFetch({url: '/login/loginProcess', body: {userId, password}});
	if(loginRes.resultCode !== 'SUCCESS'){
		alert(loginRes.resultMessage);
		return false;
	}

	// 메인 페이지 이동
	// window.location.href = "/";
}