import { util } from './util.js';
import { constant } from "./constant.js";
import { status } from "./status.js";
//import { creator } from "./creator";
import { creator } from "./creator.js";

// 그리드 번호
let sequence = 1;

// 데이터
let data = {};

// 옵션 데이터
//let option = {};

// 기본값 데이터
let basic = {};

// 페이징 데이터
let paging = {};

// 필드 데이터
let fields = {};

/**
 * 그리드 데이터 관련 객체
 */
export const reposit = {

    /**
     * 그리드 데이터 초기설정
     * @params {*} self 
     * @returns 
     */
    init: (self, params) => init(self, params),

    /**
     * 그리드 필드 데이터 가져오기
     * @params {*} self 
     * @returns 
     */
    getFields: (self) => fields[self.sequence],

    /**
     * 그리드 옵션 데이터 가져오기
     * @params {*} self 
     * @returns 
     */
    //getOption: (self) => option[self.sequence],

    /**
     * 옵션변경
     * @param {*} optionName 
     * @param {*} value 
     * @returns 
     */
    //chageOption: (self, optionName, value) => eval(`option[${self.sequence}].${optionName}=` + value),

    /**
     * 그리드 데이터 세팅
     * @params {*} self 
     * @returns 
     */
    setData: (self, params, paging) => setData(self, params, paging),

    /**
     * 그리드 데이터 추가
     * @params {*} self 
     * @params {*} data 
     * @returns 
     */
    appendData: (self, row) => data[self.sequence].data.push(row),

    /**
     * 그리드 데이터 가져오기(깊은복사)
     * @params {*} self 
     * @params {*} index 
     * @returns 
     */
    getDeepData: (self, index) => getDeepData(self, index),

    /**
     * 그리드 데이터 가져오기(얕은복사)
     * @params {*} self 
     * @params {*} index 
     * @returns 
     */
    getData: (self, index) => getData(self, index),

    /**
     * 그리드 오리지널 데이터 가져오기
     * @param {*} self 
     * @returns 
     */
    getOriginData: (self) => data[self.sequence].originData,

    /**
     * 그리드 데이터 길이 가져오기
     * @params {*} self 
     * @returns 
     */
    getDataSize: (self) => data[self.sequence].data.length,

    /**
     * 그리드 시퀀스 값으로 데이터 인덱스 구하기
     * @params {*} self 
     * @params {string/number} rowSeq 
     * @returns 
     */
    getDataRowSeq: (self, rowSeq) => data[self.sequence][status.getSeqIndex(self, rowSeq)],
    
    /**
     * 그리드 인자의 인덱스에 해당되는 데이터 가져오기
     * @params {*} self 
     * @params {number} index 
     * @returns 
     */
    getDataIndex: (self, index) => data[self.sequence][index],

    /**
     * 상태가 조회(SELECT)인 데이터 가져오기
     * @returns 
     */
    getSelectData: (self) => data[self.sequence].data.filter(item => isSelect(item._state)),

    /**
     * 상태가 추가(INSERT)인 데이터 가져오기
     * @returns 
     */
    getInsertData: (self) => data[self.sequence].data.filter(item => isInsert(item._state)),

    /**
     * 상태가 수정(UPDATE)인 데이터 가져오기
     * @returns 
     */
    getUpdateData: (self) => data[self.sequence].data.filter(item => isUpdate(item._state)),

    /**
     * 상태가 삭제(DELETE)인 데이터 가져오기
     * @returns 
     */
    getDeleteData: (self) => data[self.sequence].data.filter(item => isDelete(item._state)),
    
    /**
     * 상태가 변경(INSERT, UPDATE, DELETE)인 데이터 가져오기
     * @returns 
     */
    getApplyData: (self) => data[self.sequence].data.filter(item => !isSelect(item._state)),

    /**
     * 기본값(insert) 데이터 가져오기
     * @param {*} self 
     * @returns 
     */
    getBasicInsertData: (self) => basic[self.sequence].insert,

    getPagingData: (self) => paging[self.sequence]
}

/**
 * 그리드 데이터 관련 객체
 * @params {*} self 
 */
const init = (self, params) => {

    // 그리드 순번
    self.sequence = sequence++;

    // 기본 데이터 생성
    data[self.sequence] = {
        // 그리드 목록
        data: [],
        // 기존 데이터
        originData: {},
        // 편집 진행시 데이터
        editData: {}
    };

    // 옵션 데이터 저장
    // option[self.sequence] = initOption(params);
    // self.option = initOption(params);

    // 기본값 데이터 저장
    basic[self.sequence] = {}
    basic[self.sequence].insert = params?.data?.insert === undefined ? null : params.data.insert;

    // 필드 데이터 저장
    fields[self.sequence] = params.fields;

    // 페이징 관련 변수 세팅
    if(params?.option?.isPaging === true){
        paging[self.sequence] = {
            pageNo: params?.data?.pageNo === undefined ? 1 : params.data.pageNo,
            pageSize: params?.data?.pageSize === undefined ? 10 : params.data.pageSize,
            pageBlock: params?.data?.pageBlock === undefined ? 10 : params.data.pageBlock,
            totalCount: params?.data?.totalCount === undefined ? 0 : params.data.totalCount
        }
    // 페이징 관련 변수 (기본값)
    }else{
        paging[self.sequence] = {pageNo: 1, pageSize: 10, pageBlock: 10, totalCount: 0};
    }

    // @deprecated
    // 생성시 데이터 존재시 세팅
    // if(util.isNotEmpty(params.data)) setData(self, params);
}



// /**
//  * 데이터 재 인덱싱
//  * @params {*} self 
//  * @params {*} rowSequence 
//  */
// const reIndexing = (self, rowSequence) => {

//     // seqIndex 재 인덱싱
//     self.state.seqIndex = [];
//     data[self.sequence].forEach((item, index) => {
//         self.state.seqIndex[item._rowSeq] = index;
//     });

//     // sequence가 키인 데이터 삭제
//     if(rowSequence){
//         delete self.state.seqRowElement[rowSequence];
//         delete self.state.seqCellElement[rowSequence];
//     }
// }

/**
 * 그리드 데이터 가져오기(깊은복사)
 * @params {*} self  그리드 객체
 * @params {*} index 데이터 인덱스 값 - 해당값 존재시 해당 인덱스 데이터만 반환
 * @returns 
 */
const getDeepData = (self, index) => {
    if(util.isEmpty(index)){
        return JSON.parse(JSON.stringify(data[self.sequence].data));
    }else{
        return JSON.parse(JSON.stringify(data[self.sequence].data[index]));
    }
}

/**
 * 그리드 데이터 가져오기(얕은복사)
 * @params {*} self  그리드 객체
 * @params {*} index 데이터 인덱스 값 - 해당값 존재시 해당 인덱스 데이터만 반환
 * @returns 
 */
const getData = (self, index) => {
    if(util.isEmpty(index)){
        return data[self.sequence].data;
    }else{
        return data[self.sequence].data[index];
    }
}

/**
 * 그리드 데이터 세팅
 * @params {*} self 
 * @params {*} list 
 * @params {*} paging 
 * @returns 
 */
const setData = (self, list, paging) => {
    
    console.log('reposit setData list:: ', list);
    console.log('reposit setData paging:: ', paging);

    // let list = null;

    // // 배열
    // if(typeof params == 'object' && typeof params.length == 'number'){
    //     list = params;
    // // 객체
    // }else if(typeof params == 'object' && typeof params.length == 'undefined'){
    //     list = params.list;
    //     if(self.option.isPaging === true && params.paging){
    //         setPaging(self, params.paging);
    //     }
    // }else {
    //     console.error('setData paramsater error:', typeof params, params);
    //     return;
    // }

    // 데이터를 그리드에 삽입
    for(let item of list){
        // 기본 데이터 세팅
        // item._rowSeq = self.getNextSeq();
        item._rowSeq = status.getNextSeq(self);
        item._state = constant.row.status.select;
    }

    // 페이징 데이터 세팅
    if(self.option.isPaging === true){
        setPaging(self, paging);

        //creator.createPagination(self);
    }

    // 데이터 저장
    data[self.sequence].data = list;

    // 초기데이터 보존
    data[self.sequence].data.forEach(item => data[self.sequence].originData[item._rowSeq] = JSON.parse(JSON.stringify(item)));


    // 
    creator.refresh(self);
    //creator.createPagination(self);
}

/**
 * 페이징 변수 세팅
 * @params {*} params 
 */
const setPaging = (self, pagingData) => {
    if(pagingData?.pageNo !== undefined){
        paging[self.sequence].pageNo = pagingData.pageNo;
    }
    if(pagingData?.pageSize !== undefined){
        paging[self.sequence].pageSize = pagingData.pageSize;
    }
    if(pagingData?.pageBlock !== undefined){
        paging[self.sequence].pageBlock = pagingData.pageBlock;
    }
    if(pagingData?.totalCount !== undefined){
        paging[self.sequence].totalCount = pagingData.totalCount;
    }
}

// 상태체크 SELECT
const isSelect = state => constant.row.status.select === state;
// 상태체크 INSERT
const isInsert = state => constant.row.status.insert === state;
// 상태체크 UPDATE
const isUpdate = state => constant.row.status.update === state;
// 상태체크 REMOVE
const isRemove = state => constant.row.status.remove === state;

/**
 * @deprecated
 * 옵션데이터 세팅
 */
const initOption = (params) => {

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
        // isHead: true,
        // head:{
        //     is: true
        // },
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
        // paging: {
        //     is: false
        // }
    }

    /**
     * 그리드 헤드 표시여부
     * 기본값: true
     */
    option.isHead = params?.option?.isHead === undefined ? true : params.option.isHead;
    
    /**
     * 페이지 사용여부
     * 기본값 : false
     */
    option.isPaging = params?.option?.isPaging === undefined ? false : params.option.isPaging;

    // 옵션값 세팅
    if(params.option){
        if(params.option.style){
            if(params.option.style.width){
                option.style.width = params.option.style.width;
            }
            if(params.option.style.height){
                option.style.height = params.option.style.height + 'vh';
            }
            if(params.option.style.overflow){
                if(params.option.style.overflow.x){
                    option.style.overflow.x = params.option.style.overflow.x;
                }
                if(params.option.style.overflow.y){
                    option.style.overflow.y = params.option.style.overflow.y;
                }
               
            }
        }
        if(params.option.empty){
            if(params.option.empty.message){
                option.empty.message = params.option.empty.message;
            }
        }
        if(params.option.format){
            if(params.option.format.date){
                option.format.date = params.option.format.date
            }
        }
        // if(params.option.head){
        //     if(params.option.head.is == false){
        //         option.head.is = false;
        //     }else{
        //         option.head.is = true;
        //     }
        // }
        


        option.body.state.use = true;
        if(params.option.body){
            if(params.option.body.state){
                if(params.option.body.state.use == false){
                    option.body.state.use = false;
                }else{
                    option.body.state.use = true;
                }
            }
        }
        if(params.option.row){
            if(params.option.row.style){
                if(params.option.row.style.cursor){
                    option.row.style.cursor = params.option.row.style.cursor;
                }                    
            }
            if(params.option.row.chose == true){
                option.row.chose = params.option.row.chose;
            }
        }
        if(params?.option?.data){
            if(params.option.data.insert){
                option.data.insert = params.option.data.insert;
            }
        }
        // if(params?.option?.paging){
        //     if(params.option.paging.is === true){
        //         option.paging.is = true;
        //     }else{
        //         option.paging.is = false;
        //     }
        // }
    }
    return option;
}