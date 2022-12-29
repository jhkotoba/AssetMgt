import { reposit } from "./reposit.js";

// 그리드 상태 데이터
let states = {};

/**
 * 그리드 상태관련 객체
 */
export const status = {

    /**
     * 그리드 상태 객체 초기설정
     * @param {*} self 
     * @returns 
     */
    init: (self) => init(self),

    /**
     * 그리드 상태 초기화
     * @param {*} self 
     * @returns 
     */
    clean: (self) => clean(self), 

    // /**
    //  * 그리드 상태 데이터 가져오기
    //  * @param {*} self 
    //  * @returns 
    //  */
    // getState: (self) => states[self.sequence],
    
    /**
     * 다음시퀀스 가져오기(시퀀스 증가)
     * @param {*} self 
     * @returns 
     */
    getCurSeq: (self) => states[self.sequence].curSeq,

    /**
     * 다음시퀀스 가져오기(시퀀스 증가)
     * @param {*} self 
     * @returns 
     */
    getNextSeq: (self) => ++states[self.sequence].curSeq,

    /**
     * key:sequence value: index 인덱싱 push
     * @param {*} self 
     * @param {string} sequence 
     * @param {string} index 
     */
    setSeqIndex: (self, sequence, index) => states[self.sequence].seqIndex[sequence] = index,

    /**
     * 시퀀스번호로 데이터의 index 가져오기
     * @param {*} self
     * @param {string} sequence 
     * @returns 
     */
    getSeqIndex: (self, sequence) => states[self.sequence].seqIndex[sequence],

    /**
     * key:index value: sequence 인덱싱 push
     * @param {*} self
     * @param {string} index 
     * @param {string} sequence 
     */
	setIdxSequence: (self, index, sequence) => states[self.sequence].idxSequence[index] = sequence,
		
    /**
     * index로 시퀀스번호 가져오기
     * @param {*} self
     * @param {string} index 
     * @returns 
     */
	getIdxSequence: (self, index) => states[self.sequence].idxSequence[index],

    /**
     * 최상위 rowElement 반환
     * @param {*} self
     * @returns
     */
    getFirstRowElement: (self) => status.getSeqRowElement(self, status.getIdxSequence(self, 0)),

    /**
     * 그리드 행 엘리먼트 인덱싱
     * @param {*} self 
     * @param {string} sequence 
     * @param {element} element 
     * @returns 
     */
    setSeqRowElement: (self, sequence, element) => states[self.sequence].seqRowElement[sequence] = element,

    /**
     * 그리드 행 엘리먼트 가져오기
     * @param {*} self 
     * @param {*} sequence 
     * @returns 
     */
    getSeqRowElement: (self, sequence) => states[self.sequence].seqRowElement[sequence],

    /**
     * 그리드 셀 엘리먼트 인덱싱
     * @param {*} self 
     * @param {string} sequence 
     * @param {string} name 
     * @param {element} element 
     * @returns 
     */
    setSeqCellElement: (self, sequence, name, element) => {
        let cellElement = states[self.sequence].seqCellElement[sequence];
        if(!cellElement) cellElement = {}
        cellElement[name] = element;
    },

    /**
     * 그리드 셀 엘리먼트 가져오기
     * @param {*} self 
     * @param {string/number} sequence 
     * @param {string} name 
     * @returns 
     */
    getSeqCellElement: (self, sequence, name) => states[self.sequence].seqCellElement[sequence][name],

    /**
     * 데이터 재 인덱싱
     * @param {*} self 
     * @param {*} rowSequence 
     * @returns 
     */
    dataReIndexing: (self, rowSequence) => reIndexing(self, rowSequence)
}

/**
 * 그리드 상태 세팅 생성
 * @param {*} self 
 */
const init = (self) => {

    // 그리드 상태값 생성
    states[self.sequence] = {
        // 현재 시퀀스
        curSeq: 0,
        // 데이터 맵 key sequence value index
        seqIndex: {},
        // 데이터 맵 key index value sequence
        idxSequence: {},
        // 테이터 맵 key sequence value name element
        seqRowElement: {},
        // 테이터 맵 key sequence value name element
        seqCellElement: {}
    }
}

/**
 * 그리드 상태 정리
 * @param {*} self 
 */
const clean = (self) => {
    // 그리드 상태 초기화
    states[self.sequence].seqIndex = {};
    states[self.sequence].idxSequence = {};
    states[self.sequence].seqRowElement = {};
    states[self.sequence].seqCellElement = {};
}

/**
 * 데이터 재 인덱싱
 * @param {*} self 
 * @param {*} rowSequence 
 */
const reIndexing = (self, rowSequence) => {

    let data = reposit.getData(self);
    let seqIndex = states[self.sequence];

    // seqIndex 재 인덱싱
    data.forEach((item, index) => seqIndex[item._rowSeq] = index);

    // sequence가 키인 데이터 삭제
    if(rowSequence){
        delete states[self.sequence].seqRowElement[rowSequence];
        delete states[self.sequence].seqCellElement[rowSequence];
    }
}