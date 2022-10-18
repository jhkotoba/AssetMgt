import { postFetch } from "/script/common/fetch.js";

window.addEventListener("DOMContentLoaded", event => menu.createMenu());

const menu = {

    data: {
        origin: [], topList: [], subList: []
    },
    grid: {
        top: null, sub: null,
    },

    /**
     *  메뉴 최초생성
     */
    createMenu() {

        // 메뉴목록 조회
        postFetch({url: '/system/getMenuList', body: {}})
            .then(res => res.resultCode == 'SUCCESS' ? this.data.origin = res.data : Promise.reject(new Error(res.message)))
            .then(() => this.grid.top && this.grid.sub ? this.initGrid() : null)
            .catch(error => alert(error));

        // 상위메뉴 그리드 생성
        this.grid.top = new wGrid('topMenu', {
            fields: [
                {title:'메뉴번호', element: 'text', name: 'menuNo', width: '5%'},
                {title:'메뉴명', element: 'text', name: 'menuNm', width: '45%'},
                {title:'메뉴순번', element: 'text', name: 'menuSeq', width: '5%'},
                {title:'전시여부', element: 'text', name: 'dispYn', width: '5%'},
                {title:'사용여부', element: 'text', name: 'useYn', width: '5%'},
                {title:'등록자', element: 'text', name: 'insNo', width: '5%'},
                {title:'등록일시', element: 'text', name: 'insDttm', width: '10%'},
                {title:'수정자', element: 'text', name: 'uptNo', width: '5%'},
                {title:'수정일시', element: 'text', name: 'uptDttm', width: '10%'},
            ],
            option: { style: {
                height: '34.5vh', overflow: { y: 'scroll'}},
                row: { style: {cursor: 'pointer'}, chose: true }
            },
            event: {
                click: (event, item, index, sequence) => {
                   
                }
            }
        });

        // 하위메뉴 그리드 생성
        this.grid.sub = new wGrid('subMenu', {
            fields: [
                {title:'메뉴번호', element: 'text', name: 'menuNo', width: '5%'},
                {title:'메뉴명', element: 'text', name: 'menuNm', width: '25%'},
                {title:'메뉴URL', element: 'text', name: 'menuUrl', width: '25%'},                
                {title:'메뉴순번', element: 'text', name: 'menuSeq', width: '5%'},
                {title:'전시여부', element: 'text', name: 'dispYn', width: '5%'},
                {title:'사용여부', element: 'text', name: 'useYn', width: '5%'},
                {title:'등록자', element: 'text', name: 'insNo', width: '5%'},
                {title:'등록일시', element: 'text', name: 'insDttm', width: '10%'},
                {title:'수정자', element: 'text', name: 'uptNo', width: '5%'},
                {title:'수정일시', element: 'text', name: 'uptDttm', width: '10%'},
            ],
            option: { style: { height: '34.5vh', overflow: { y: 'scroll'}} }
        });
    
        this.data.origin.length > 0 ? this.initGrid() : null;
    },

    /**
     * 메뉴 데이터 초기화
     */
    initGrid(){
        this.data.topList = [];
        this.data.subList = [];
        this.grid.top.empty();
        this.grid.sub.empty();

        // 상위메뉴 하위메뉴 분리
        this.data.origin.forEach(item => item.menuLv == 1 ? this.data.topList.push(item) : this.data.subList.push(item));
        // 상위메뉴 세팅
        this.grid.top.setData(this.data.topList.sort((a,b) => a.menuSeq - b.menuSeq));
    }
}

window.menu2 = menu;