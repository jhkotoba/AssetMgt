import { constant } from "/script/common/common.js";

/**
 * 사이드 메뉴 및 이벤트 생성
 */
const aside = document.getElementsByTagName('aside')[0];
aside.innerHTML = sessionStorage.getItem(constant.storage.menu);
aside.addEventListener('click', event => {
    console.log(event.target.textContent);

    const lv = event.target.dataset;
    console.log(lv);
    
    
});
