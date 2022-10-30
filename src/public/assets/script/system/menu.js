import { postFetch } from "/script/common/fetch.js";

window.addEventListener("DOMContentLoaded", function(){
    // 메뉴생성
    menu.createMenu();
    
    // 메뉴관리 이벤트 생성
    menu.createEvent();
});

const menu = {

    data: {
        origin: [], topList: [], subList: [],
        mapping: {
            mapping: {Y: '사용', N: '미사용'},
            select: {list: [{value:'Y', text:'사용'}, {value:'N', text:'미사용'}]}
        }
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
                {title: null, element:'checkbox', name: 'check', edit: 'checkbox', width:'3%', align:'center'},
                {title:'메뉴번호', element: 'text', name: 'menuNo', width: '5%'},
                {title:'메뉴명', element: 'text', name: 'menuNm', edit: 'text', width: '38%'},
                {title:'메뉴순번', element: 'text', name: 'menuSeq', edit: 'number', width: '5%'},
                {title:'전시여부', element: 'text', name: 'dispYn', edit:'select', width: '7%', data: this.data.mapping},
                {title:'사용여부', element: 'text', name: 'useYn', edit:'select', width: '7%', data: this.data.mapping},
                {title:'등록자', element: 'text', name: 'insNo', width: '5%'},
                {title:'등록일시', element: 'text', name: 'insDttm', width: '10%'},
                {title:'수정자', element: 'text', name: 'uptNo', width: '5%'},
                {title:'수정일시', element: 'text', name: 'uptDttm', width: '10%'},
            ],
            option: { style: {
                height: '34.5vh', overflow: { y: 'scroll'}},
                body: { state: true },
                row: { style: {cursor: 'pointer'}, chose: true }
            },
            event: {
                click: (event, item, index, sequence) => {
                    if(['INPUT', 'SELECT', 'BUTTON'].includes(event.target.tagName) == false){
                        let list = this.data.subList.filter(f => item.menuSeq == f.groupNo);
                        this.grid.sub.setData(JSON.parse(JSON.stringify(list)));
                    }
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
                {title:'전시여부', element: 'select', name: 'dispYn', width: '5%', data: this.data.ynData},
                {title:'사용여부', element: 'select', name: 'useYn', width: '5%', data: this.data.ynData},
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
        this.data.origin.forEach(item => {
            item.check = false;
            item.menuLv == 1 ? this.data.topList.push(item) : this.data.subList.push(item)
        });
        this.grid.top.setData(JSON.parse(JSON.stringify(this.data.topList)).sort((a,b) => a.menuSeq - b.menuSeq));
    },

    /**
     * 메뉴 이벤트 생성
     */
    createEvent(){

        topAdd.addEventListener('click', () => this.grid.top.prependRow());
        // 상 그리드 편집 버튼
        topEdit.addEventListener('click', () => this.grid.top.modifyStateCheckedElement('check'));
        // 상위 그리드 삭제 버튼
        topRemove.addEventListener('click', () => this.grid.top.removeStateCheckedElement('check'));
        // 상위 그리드 취소 버튼
        topCancel.addEventListener('click', () => this.grid.top.cancelStateCheckedElement('check'));        
        // 상위 그리드 저장 버튼
        topSave.addEventListener('click', () => this.applyTopMenu(this.grid.top.getApplyData()));

        // 하위 그리드 취소 버튼
        // 하위 그리드 편집 버튼
        // 하위 그리드 저장 버튼
    },

    /**
     * 메뉴정보 등록/수정/삭제 적용
     * @param {array<object>} list 
     */
    applyTopMenu(list){

        if(list.filter(f => f._state == 'REMOVE').length > 0){
            if(confirm('상위메뉴 삭제시 하위메뉴도 삭제됩니다. 진행하시겠습니까?') == false){
                return false;
            }
        }

        if(confirm('등록/수정/삭제 내역을 저장하시겠습니까?') == false){
            return false;
        }

        postFetch({url: '/system/applyMenu', body: {menuLv: 1, applyList: list}})
            .then(res => console.log(res))
            .catch(error => alert(error));
    }
}

window.menu2 = menu;