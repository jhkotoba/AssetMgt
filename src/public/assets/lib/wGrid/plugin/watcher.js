import { util } from './util.js';
import { reposit } from "./reposit.js";
import { status } from "./status.js";
import { creator } from "./creator.js";


/**
 * 이벤트 데이터
 */
let events = {};

/**
 * 그리드 이벤트 관련 객체
 */
export const watcher = {

    /**
     * 그리드 상태 객체 초기설정
     * @param {*} self
     * @returns 
     */
    init: (self) => init(self)
}

/**
 * 그리드 이벤트 관련 초기설정
 * @param {*} self
 */
const init = (self) => {

    // 생성할 이벤트 종류
    let evList = ["click", "change", "keyup"];
    // 내부 연결 이벤트
    let innerEvent = {};
    // 필드 데이터
    let fields = reposit.getFields(self);

    // 필드 이벤트 세팅
    for(let i=0; i<fields.length; i++){
        
        let field = fields[i];
        
        // 빈값이면 통과
        if(field.event == undefined || field.event == null){
            continue;
        }

        // 그리드 내부 연결 이벤트 세팅
        evList.forEach(evName => {                
            if(field.event[evName]){

                // 빈값체크
                if(!innerEvent[evName]) innerEvent[evName] = {};

                // 이벤트 등록
                innerEvent[evName][field.name] = {
                    head: field.event[evName].head ? field.event[evName].head : null,
                    body: field.event[evName].body ? field.event[evName].body : null
                }
            }
        });
    }

    // 그리드 HEAD HTML
    let headElement = creator.getHeadElement(self);
    // 그리드 BODY HTML
    let bodyElement = creator.getBodyElement(self);
    // 그리드 BODY Table HTML
    let bodyTbElement = creator.getBodyTbElement(self);

    // 헤드 이벤트 세팅
    for(let i=0; i<evList.length; i++){
        // 이벤트 등록
        headElement.addEventListener(evList[i], event => {

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

        bodyElement.addEventListener(evList[i], event => {
            // 체크박스 클릭이벤트 강제 종료
            if(event.type == 'click' && event.target.dataset.sync == 'checkbox') return;
            
            let row = util.closest("TR", event.target);
            if(!row)return;
            
            let sequence = row.dataset.rowSeq;
            //let index = self.getSeqIndex(sequence);
            let index = status.getSeqIndex(self, sequence);
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
                bodyTbElement.childNodes.forEach(item => item.classList.remove(constant.class.row.choose));
                row.classList.add(constant.class.row.choose);
            }

            event.stopPropagation();
        });
    }

    //events[self.sequence] = innerEvent;

    // return innerEvent;
}