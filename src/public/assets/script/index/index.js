import { constant } from "/script/common/common.js";

/**
 * 사이드 메뉴 생성
 */
document.getElementsByTagName('aside')[0].innerHTML = sessionStorage.getItem(constant.storage.menu);