import { util } from './util.js';
import { constant } from "./constant.js";

/**
 * 그리드 데이터 관련 객체
 */
export const reposit = {

    /**
     * 
     * @param {*} self 
     * @returns 
     */
    init: (self, params) => init(self, params),

    /**
     * 그리드 데이터 가져오기
     * @param {*} self 
     * @returns 
     */
    getData: (self, option) => getData(self, option),

    /**
     * 그리드 데이터 추가
     * @param {*} self 
     * @returns 
     */
    setData: (self, params) => setData(self, params)
}

/**
 * 그리드 데이터 관련 객체
 * @param {*} self 
 */
const init = (self, params) => {

    // 기본 데이터 생성
    self.data = [];

    // 기존 데이터 저장
    self.originData = {};

    // 그리드 편집시 데이터 변수
    self.editData = {};

    // 페이징 관련 변수 (기본값)
    self.paging = {pageNo: 1, pageSize: 10, pageBlock: 10, totolCount: 0};

    // 생성시 데이터 존재시 세팅
    if(util.isNotEmpty(params.data)) setData(self, params);
}

/**
 * 그리드 데이터 가져오기
 * @param {*} self 
 * @param {*} option 
 * @returns 
 */
const getData = (self, option) => {
    if(option?.isShallow === true){
        return self.data;
    }else{
        return JSON.parse(JSON.stringify(self.data));
    }
}

/**
 * 그리드 데이터 추가
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
    self.data = list;

    // 초기데이터 보존
    self.data.forEach(item => self.originData[item._rowSeq] = JSON.parse(JSON.stringify(item)));
}

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