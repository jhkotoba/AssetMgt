import { util } from './util.js';
import { constant } from "./constant.js";

// 그리드 번호
let sequence = 1;

// 데이터
let data = {};

// 페이징 데이터
let paging = {};

// 그리드 필드 데이터
let fields = {};

/**
 * 그리드 데이터 관련 객체
 */
export const reposit = {

    /**
     * 그리드 데이터 초기설정
     * @param {*} self 
     * @returns 
     */
    init: (self, params) => init(self, params),

    /**
     * 그리드 데이터 가져오기(깊은복사)
     * @param {*} self 
     * @returns 
     */
    getDeepData: (self) => getDeepData(self),

    /**
     * 그리드 데이터 가져오기(얕은복사)
     * @param {*} self 
     * @returns 
     */
    getShallowData: (self) => getShallowData(self),

    /**
     * 그리드 데이터 길이 가져오기
     * @param {*} self 
     * @returns 
     */
    getDataSize: (self) => data[self.sequence].data.length,

    /**
     * 그리드 데이터 세팅
     * @param {*} self 
     * @returns 
     */
    setData: (self, params) => setData(self, params),

    /**
     * 그리드 데이터 추가
     * @param {*} self 
     * @param {*} data 
     * @returns 
     */
    appendData: (self, row) => appendData(self, row),

    /**
     * 그리드 필드 데이터 가져오기
     * @param {*} self 
     * @returns 
     */
    getFields: (self) => getFields(self),

    /**
     * 데이터 재 인덱싱
     * @param {*} self 
     * @param {*} rowSequence 
     * @returns 
     */
    dataReIndexing: (self, rowSequence) => reIndexing(self, rowSequence)
}

/**
 * 그리드 데이터 관련 객체
 * @param {*} self 
 */
const init = (self, params) => {

    // 그리드 순번
    console.log('sequence:', sequence);
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

    // 필드 데이터 저장
    fields[self.sequence] = params.fields;

    // 페이징 관련 변수 (기본값)
    paging[self.sequence] = {pageNo: 1, pageSize: 10, pageBlock: 10, totolCount: 0};

    // 생성시 데이터 존재시 세팅
    if(util.isNotEmpty(params.data)) setData(self, params);
}

/**
 * 데이터 재 인덱싱
 * @param {*} self 
 * @param {*} rowSequence 
 */
const reIndexing = (self, rowSequence) => {

    // seqIndex 재 인덱싱
    self.state.seqIndex = [];
    self.data.forEach((item, index) => {
        self.state.seqIndex[item._rowSeq] = index;
    });

    // sequence가 키인 데이터 삭제
    if(rowSequence){
        delete self.state.seqRowElement[rowSequence];
        delete self.state.seqCellElement[rowSequence];
    }
}

/**
 * 그리드 데이터 가져오기(깊은복사)
 * @param {*} self 
 * @param {*} option 
 * @returns 
 */
const getDeepData = (self) => JSON.parse(JSON.stringify(data[self.sequence].data));

/**
 * 그리드 데이터 가져오기(얕은복사)
 * @param {*} self 
 * @param {*} option 
 * @returns 
 */
const getShallowData = (self) => data[self.sequence].data;

/**
 * 그리드 데이터 세팅
 * @param {*} self 
 * @param {*} params 
 * @returns 
 */
const setData = (self, params) => {

    let list = null;

    // 배열
    if(typeof params == 'object' && typeof params.length == 'number'){
        list = params;
    // 객체
    }else if(typeof params == 'object' && typeof params.length == 'undefined'){
        list = params.list;
        if(self.option.paging.is === true && params.paging){
            setPaging(self, params.paging);
        }
    }else {
        console.error('setData paramater error:', typeof params, params);
        return;
    }

    // 데이터를 그리드에 삽입
    for(let item of list){
        // 기본 데이터 세팅
        item._rowSeq = self.getNextSeq();
        item._state = constant.row.status.select;
    }

    // 데이터 저장
    data[self.sequence].data = list;

    // 초기데이터 보존
    data[self.sequence].data.forEach(item => data[self.sequence].originData[item._rowSeq] = JSON.parse(JSON.stringify(item)));
}

/**
 * 그리드 데이터 추가
 * @param {*} self 
 * @param {*} data 
 * @returns 
 */
const appendData = (self, row) => data[self.sequence].data.push(row);

/**
 * 그리드 필드 데이터 가져오기
 * @param {*} self 
 * @returns 
 */
const getFields = (self) => fields[self.sequence];

/**
 * 페이징 변수 세팅
 * @param {*} params 
 */
const setPaging = (self, params) => {
    if(params.paging?.no) self.paging.no = params.paging.no;
    if(params.paging?.size) self.paging.size = params.paging.size;
    if(params.paging?.block) self.paging.block = params.paging.block;
    if(params.paging?.totolCount) self.paging.totolCount = params.paging.totolCount;
}