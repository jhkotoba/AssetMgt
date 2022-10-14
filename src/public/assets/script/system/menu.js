import { postFetch } from "/script/common/fetch.js";

window.addEventListener("DOMContentLoaded", event => menu.createMenu());

const menu = {

    data: {
        origin: [], topList: [], subList: []
    },
    grid: {
        top: null, sub: null,
    },

    createMenu() {

        postFetch({url: '/system/getMenuList', body: {}})
            .then(res => res.resultCode == 'SUCCESS' ? this.data.origin = res.data : Promise.reject(new Error(res.message)))
            .then(() => this.grid.top && this.grid.sub ? this.initGrid() : null)
            .catch(error => alert(error));

        this.grid.top = new wGrid('topMenu', {
            fields: [
                {title:'메뉴번호', element: 'text', name: 'menuNo', width: '5%'},
                {title:'메뉴명', element: 'text', name: 'menuNm', width: '15%'},
                {title:'메뉴URL', element: 'text', name: 'menuUrl', width: '25%'},
                {title:'메뉴단계', element: 'text', name: 'menuLv', width: '5%'},
                {title:'메뉴순번', element: 'text', name: 'menuSeq', width: '5%'},
                {title:'그룹번호', element: 'text', name: 'groupNo', width: '5%'},
                {title:'전시여부', element: 'text', name: 'dispYn', width: '5%'},
                {title:'사용여부', element: 'text', name: 'useYn', width: '5%'},
                {title:'등록자', element: 'text', name: 'insNo', width: '5%'},
                {title:'등록일시', element: 'text', name: 'insDttm', width: '10%'},
                {title:'수정자', element: 'text', name: 'uptNo', width: '5%'},
                {title:'수정일시', element: 'text', name: 'uptDttm', width: '10%'},
            ]
        });

        this.grid.sub = new wGrid('subMenu', {
            fields: [
                {title:'메뉴번호', element: 'text', name: 'menuNo', width: '5%'},
                {title:'메뉴명', element: 'text', name: 'menuNm', width: '15%'},
                {title:'메뉴URL', element: 'text', name: 'menuUrl', width: '25%'},
                {title:'메뉴단계', element: 'text', name: 'menuLv', width: '5%'},
                {title:'메뉴순번', element: 'text', name: 'menuSeq', width: '5%'},
                {title:'그룹번호', element: 'text', name: 'groupNo', width: '5%'},
                {title:'전시여부', element: 'text', name: 'dispYn', width: '5%'},
                {title:'사용여부', element: 'text', name: 'useYn', width: '5%'},
                {title:'등록자', element: 'text', name: 'insNo', width: '5%'},
                {title:'등록일시', element: 'text', name: 'insDttm', width: '10%'},
                {title:'수정자', element: 'text', name: 'uptNo', width: '5%'},
                {title:'수정일시', element: 'text', name: 'uptDttm', width: '10%'},
            ]
        });

        this.data.origin.length > 0 ? this.initGrid() : null;
    },

    initGrid(){

        this.data.topList = [];
        this.data.subList = [];
        this.grid.top.empty();
        this.grid.sub.empty();

        this.data.origin.forEach(item => item.menuLv == 1 ? this.data.topList.push(item) : this.data.subList.push(item));
        this.grid.top.setData(this.data.topList);
    }
}