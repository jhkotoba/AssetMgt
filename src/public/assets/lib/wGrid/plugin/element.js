// import { util } from "./util.js";
// import { constant } from "./constant.js";

// // 엘리먼트 데이터
// let elements = {};

// /**
//  * 그리드 태그 엘리먼트 관련 객체
//  */
// export const element = {
    
//     /**
//      * 그리드 엘리먼트 초기설정
//      * @param {*} self 
//      * @returns 
//      */
//     init: (self) => init(self),

//     /**
//      * 그리드 헤드 엘리먼트 가져오기
//      * @param {*} self 
//      * @returns 
//      */
//     getHead: (self) => elements[self.sequence].head,

//     /**
//      * HeadTr 자식노드 비우기
//      * @param {*} self 
//      * @returns 
//      */
//     emptyHeadTr: (self) => util.elementEmpty(elements[self.sequence].headTr),

//     /**
//      * 그리드 바디 엘리먼트 가져오기
//      * @param {*} self 
//      * @returns 
//      */
//     getBody: (self) => elements[self.sequence].body
// }

// /**
//  * 그리드 엘리먼트 초기설정
//  * @param {*} self 
//  */
// const init = (self) => {

//     // 그리드에 사용되는 엘리먼트 생성
//     let id = self.id;
//     let target = document.getElementById(id);
//     let head = document.createElement('div');
//     let headTb = document.createElement('table');
//     let headTr = document.createElement('tr');
//     let body = document.createElement('div');
//     let bodyTb = document.createElement('table');
//     let bodyEmpty = document.createElement('div');
//     let pagination = document.createElement('div');
    
//     // 그리드 스타일 적용
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

//     elements[self.sequence] = {id, target, head, headTb, headTr, body, bodyTb, bodyEmpty, pagination};

//     // 그리드 css 세팅
//     // el.target.classList.add("wgrid");
//     //     if(param?.option?.style?.width){
//     //         el.target.style.width = param.option.style.width;
//     //     }     

//     //     if(param?.option?.style?.height){
//     //         el.body.style.height = param.option.style.height + 'vh';
//     //     }

//     //     if(param?.option?.style?.overflow?.x == 'overlay' || param?.option?.style?.overflow?.x == 'scroll'){
//     //         el.head.style.overflowX = param.option.style.overflow.x;
//     //         el.body.style.overflowX = param.option.style.overflow.x;
//     //     }
//     //     if(param?.option?.style?.overflow?.y == 'overlay' || param?.option?.style?.overflow?.y == 'scroll'){
//     //         el.head.style.overflowY = param.option.style.overflow.y;
//     //         el.body.style.overflowY = param.option.style.overflow.y;
//     //     }
// }

// //const getHead = (self) => elements[self.sequence].head;