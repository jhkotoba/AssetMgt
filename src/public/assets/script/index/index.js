import { constant } from "/script/common/common.js";

/**
 * 사이드 메뉴 및 이벤트 생성
 */
const aside = document.getElementsByTagName('aside')[0];
aside.innerHTML = sessionStorage.getItem(constant.storage.menu);
aside.addEventListener('click', event => {
    if(event.target.dataset.lv == 1){
        let cList = event.target.nextSibling.childNodes[0].classList;
        cList.contains('off') ? cList.remove('off') : cList.add('off');
    }else{
        sessionStorage.setItem(constant.storage.menu, document.getElementsByTagName('aside')[0].innerHTML);
        document.location.href = event.target.dataset.url;
    }
});
