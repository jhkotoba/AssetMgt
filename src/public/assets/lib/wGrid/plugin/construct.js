import { util } from "./util.js";
import { constant } from "./constant.js";
import { reposit } from "./reposit.js";

 

/**
 * wGird 초기생성
 */
// const constant = {
//     STATE: {
//         SELECT: 'SELECT',
//         INSERT: 'INSERT',
//         UPDATE: 'UPDATE',
//         REMOVE: 'REMOVE'
//     },
//     class:{
//         select: '',
//         insert: 'insert',
//         update: 'update',
//         remove: 'remove',
//         choose: 'choose',
//         header: 'header',
//         body: 'body',
//         pagination: 'pagination',
//         button: 'wgrid-btn'
//     },
//     EMPTY: "EMPTY"
// }

export const construct = {

    /**
     * 그리드 상태값 생성
     * @returns 
     */   
    // createState(){
    //     return {
    //         curSeq: 0,      // 현재 시퀀스
    //         seqIndex: {},   // 데이터 맵 key sequence value index
    //         idxSequence: {}, // 데이터 맵 key index value sequence
    //         seqRowElement: {}, // 테이터 맵 key sequence value name element
    //         seqCellElement: {} // 테이터 맵 key sequence value name element
    //     }
    // },

    /**
     * wGrid 생성시 엘리먼트 값 저장
     * @param {string} targetId 
     * @returns 
     */
    // createElement(id){

    //     let target = document.getElementById(id);
    //     let head = document.createElement('div');
    //     let headTb = document.createElement('table');
    //     let headTr = document.createElement('tr');
    //     let body = document.createElement('div');
    //     let bodyTb = document.createElement('table');
    //     let bodyEmpty = document.createElement('div');
    //     let pagination = document.createElement('div');
        
    //     head.classList.add(constant.class.header);
    //     body.classList.add(constant.class.body);
    //     pagination.classList.add(constant.class.pagination);

    //     headTb.appendChild(headTr);
    //     head.appendChild(headTb);

    //     body.appendChild(bodyTb);
    //     body.appendChild(bodyEmpty);

    //     target.appendChild(head);
    //     target.appendChild(body);
    //     target.appendChild(pagination);

    //     return {id, target, head, headTb, headTr, body, bodyTb, bodyEmpty, pagination}

        
    // },

    /**
     * wGrid 생성시 그리드 내부 상수 세팅
     * @returns 
     */
    createConstant(){
        return constant;
    },

    /**
     * wGrid 생성시 옵션 세팅
     * @param {object} param 
     * @returns 
     */
    createOption(param){

        // 옵션 기본값 세팅
        let option = {
            style:{
                width: '100%', 
                height: '500vh',
                overflow: {
                    x: null, y: null
                }
            },
            format:{
                date: "YYYY-MM-DD"
            },
            empty:{
                message: "no data"
            },
            head:{
                is: true
            },
            body: {
                state:{
                    use: false
                }
            },
            row: {
                style:{                    
                    cursor: "inherit",
                },
                chose: false
            },
            checkbox: {
                check: true,
                uncheck: false
            },
            data: {
                insert: null
            },
            paging: {
                is: false
            }
        }

        // 옵션값 세팅
        if(param.option){
            if(param.option.style){
                if(param.option.style.width){
                    option.style.width = param.option.style.width;
                }
                if(param.option.style.height){
                    option.style.height = param.option.style.height + 'vh';
                }
                if(param.option.style.overflow){
                    if(param.option.style.overflow.x){
                        option.style.overflow.x = param.option.style.overflow.x;
                    }
                    if(param.option.style.overflow.y){
                        option.style.overflow.y = param.option.style.overflow.y;
                    }
                   
                }
            }
            if(param.option.empty){
                if(param.option.empty.message){
                    option.empty.message = param.option.empty.message;
                }
            }
            if(param.option.format){
                if(param.option.format.date){
                    option.format.date = param.option.format.date
                }
            }
            if(param.option.head){
                if(param.option.head.is == false){
                    option.head.is = false;
                }else{
                    option.head.is = true;
                }
            }
            option.body.state.use = true;
            if(param.option.body){
                if(param.option.body.state){
                    if(param.option.body.state.use == false){
                        option.body.state.use = false;
                    }else{
                        option.body.state.use = true;
                    }
                }
            }
            if(param.option.row){
                if(param.option.row.style){
                    if(param.option.row.style.cursor){
                        option.row.style.cursor = param.option.row.style.cursor;
                    }                    
                }
                if(param.option.row.chose == true){
                    option.row.chose = param.option.row.chose;
                }
            }
            if(param?.option?.data){
                if(param.option.data.insert){
                    option.data.insert = param.option.data.insert;
                }
            }
            if(param?.option?.paging){
                if(param.option.paging.is === true){
                    option.paging.is = true;
                }else{
                    option.paging.is = false;
                }
            }
        }
        return option;
    },

    /**
     * wGrid 생성시 그리드 세팅
     * @param {element} el 
     * @param {object} param 
     */
    settingGrid(el, param){

        el.target.classList.add("wgrid");
        if(param?.option?.style?.width){
            el.target.style.width = param.option.style.width;
        }     

        if(param?.option?.style?.height){
            el.body.style.height = param.option.style.height + 'vh';
        }

        if(param?.option?.style?.overflow?.x == 'overlay' || param?.option?.style?.overflow?.x == 'scroll'){
            el.head.style.overflowX = param.option.style.overflow.x;
            el.body.style.overflowX = param.option.style.overflow.x;
        }
        if(param?.option?.style?.overflow?.y == 'overlay' || param?.option?.style?.overflow?.y == 'scroll'){
            el.head.style.overflowY = param.option.style.overflow.y;
            el.body.style.overflowY = param.option.style.overflow.y;
        }
    },

    /**
     * wGrid 생성시 그리드 이벤트 세팅
     * @param {this} self 
     * @param {object} param 
     * @returns 
     */
    createEvent(self, param){

        // 생성할 이벤트 종류
        let evList = ["click", "change", "keyup"];
        // 내부 연결 이벤트
        let innerEvent = {};

        // 필드 이벤트 세팅
        for(let i=0; i<param.fields.length; i++){
            
            let item = param.fields[i];
            
            // 빈값이면 통과
            if(item.event == undefined || item.event == null){
                continue;
            }

            // 그리드 내부 연결 이벤트 세팅
            evList.forEach(evName => {                
                if(item.event[evName]){

                    // 빈값체크
                    if(!innerEvent[evName]) innerEvent[evName] = {};

                    // 이벤트 등록
                    innerEvent[evName][item.name] = {
                        head: item.event[evName].head ? item.event[evName].head : null,
                        body: item.event[evName].body ? item.event[evName].body : null
                    }
                }
            });
        }

        // 헤드 이벤트 세팅
        for(let i=0; i<evList.length; i++){
            // 이벤트 등록
            self.element.head.addEventListener(evList[i], event => {

                // 헤드 체크박스 전체선택
                if(event.target.type == 'checkbox' && evList[i] == 'change'){
                    self.setAllChecked(event.target.name, event.target.checked);
                }
                
                if(innerEvent[evList[i]]
                    && innerEvent[evList[i]][event.target.name]
                    && innerEvent[evList[i]][event.target.name].head ){
                    // 연결된 이벤트 호출
                    innerEvent[evList[i]][event.target.name].head(event);
                }
                event.stopPropagation();
            });
        }

        // 바디 이벤트 세팅
        for(let i=0; i<evList.length; i++){

            self.element.body.addEventListener(evList[i], event => {
                // 체크박스 클릭이벤트 강제 종료
                if(event.type == 'click' && event.target.dataset.sync == 'checkbox') return;
                
                let row = util.closest("TR", event.target);
                if(!row)return;
                
                let sequence = row.dataset.rowSeq;
                let index = self.getSeqIndex(sequence);
                let data = reposit.getData(self, index);

                // 데이터 동기화
                switch(event.target.dataset.sync){
                case 'checkbox':
                    data[event.target.name] = 
                        event.target.checked == true ? self.option.checkbox.check : self.option.checkbox.uncheck;
                    break;
                case 'number':
                    let number = Number(event.target.value.replace('/[^0-9]/g', ''));
                    let value = Number.isNaN(number) ? data[event.target.name] : number;
                    data[event.target.name] = value;
                    event.target.value = value;
                    break;
                case 'text': case 'select': case 'date': case 'dateTime':
                    data[event.target.name] = event.target.value;
                    break;
                }

                // 연결할 이벤트 체크
                if(innerEvent[evList[i]]
                    && innerEvent[evList[i]][event.target.name]
                    && innerEvent[evList[i]][event.target.name].body ){
                    // 연결된 이벤트 호출
                    innerEvent[evList[i]][event.target.name].body(
                        event,
                        reposit.getDeepData(self, index),
                        index,
                        sequence
                    );
                }

                // 외부 이벤트 체크
                if(self.outerEvent && self.outerEvent[evList[i]]){
                    // 정의된 외부 이벤트 호출
                    self.outerEvent[evList[i]](
                        event,
                        reposit.getDeepData(self, index),
                        index,
                        sequence
                    );
                }

                /**
                 * 그리드 내부 이벤트 
                 */
                // 행선택 chose 옵션 설정시
                if(evList[i] == 'click' 
                && ['INPUT', 'SELECT', 'BUTTON'].includes(event.target.tagName) == false
                && self.option.row.chose == true){
                    self.element.bodyTb.childNodes.forEach(item => item.classList.remove(constant.class.row.choose));
                    row.classList.add(constant.class.row.choose);
                }

                event.stopPropagation();
            });
        }

        return innerEvent;
    }
}