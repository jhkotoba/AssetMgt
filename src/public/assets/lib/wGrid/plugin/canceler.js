import { util } from './util.js';
import { constant } from "./constant.js";
import { reposit } from "./reposit.js";
import { status } from "./status.js";
import { creator } from "./creator.js";
import { deleter } from "./deleter.js";


/**
 * 그리드 취소 관련 객체
 */
export const canceler = {

    /**
     * 그리드 취소 관련 객체 초기설정
     * @param {*} self
     * @returns 
     */
    init: (self) => init(self),

    /**
     * 수정/삭제 상태를 취소
     * @param {*} self 
     * @param {number/string} rowSeq    행 시퀀스
     */
    cancelRowSeq: (self, rowSeq) => cancelRow(self, status.getSeqIndex(self, rowSeq), rowSeq),

    /**
     * 수정/삭제 상태를 취소
     * @param {*} self 
     * @param {number} rowIdx    행 IDX
     */
    cancelRowIdx: (self, rowIdx) => cancelRow(self, rowIdx, status.getIdxSequence(self, rowIdx)),

    /**
     * 수정/삭제 상태를 취소
     * @param {*} self 
     * @param {number/string} rowSeq    행 시퀀스
     * @param {number} rowIdx    행 IDX
     */
    cancelRow: (self, rowIdx, rowSeq) => cancelRow(self, rowIdx, rowSeq),

    /**
     * 선택한 체크박스의 행을 편집,삭제 상태로 부터 복원
     * @param {*} self
     * @param {string} name 필드명
     * @returns 
     */
    cancelRowCheckedElement: (self, name) => cancelRowElement(self, null, status.getNameCheckedSeqs(self, name)),

    /**
     * 행을 편집,삭제 상태로 부터 복원 (rowIdxList)
     * @param {*} self
     * @param {Array} rowIdxList 
     */
    cancelRowElementRowIdxs: (self, rowIdxList) => cancelRowElement(self, rowIdxList, null),

    /**
     * 행을 편집,삭제 상태로 부터 복원 (rowSeqList)
     * @param {*} self
     * @param {Array} rowSeqList 
     */
    cancelRowElementRowSeqs: (self, rowSeqList) => cancelRowElement(self, null, rowSeqList),

    /**
     * 행을 편집,삭제 상태로 부터 복원 (rowIdx)
     * @param {*} self
     * @param {number} rowIdx 
     */
    cancelRowElementRowIdx: (self, rowIdx) => cancelRowElement(self, [rowIdx], null),    

    /**
     * 행을 편집,삭제 상태로 부터 복원 (rowSeq)
     * @param {*} self
     * @param {number} rowSeq 
     */
    cancelRowElementRowSeq: (self, rowSeq) => cancelRowElement(self, null, [rowSeq]),    

    /**
     * 행을 편집,삭제 상태로 부터 복원
     * @param {*} self
     * @param {number} rowIdx 
     */
    cancelRowElement: (self, rowIdx, rowSeq) => cancelRowElement(self, [rowIdx], [rowSeq]),
}

const init = (self) => {}

/**
 * 수정/삭제 상태를 취소
 * @param {*} self 
 * @param {number} rowIdx 행 IDX
 * @param {number/string} rowSeq 행 시퀀스
 */
const cancelRow = (self, rowIdx, rowSeq) => {

    let rowElement = status.getSeqRowElement(self, rowSeq);
    let option = reposit.getOption(self);
    let data = reposit.getData(self);
        
    // style class 삭제
    if(option.body.state.use == true){
        if(data[rowIdx]._state == constant.row.status.update){
            rowElement.classList.remove(constant.row.status.update);
        }else if(data[rowIdx]._state == constant.row.status.remove){
            rowElement.classList.remove(constant.row.status.remove);
        }
    }

    // Disabled 해제
    reposit.getFields(self).fields.forEach(field => status.getSeqCellElement(self, rowSeq, field.name).disabled = false);

    // 데이터 행상태 값 변경
    if(rowElement.classList.contains(constant.class.row.update)){
        data[rowIdx]._state = constant.row.status.update;
    }else{
        data[rowIdx]._state = constant.row.status.select;
    }
}

/**
 * 행을 편집,삭제 상태로 부터 복원 (rowIdx)
 * @param {*} self
 * @param {numberList} rowIdxList
 * @param {stringList} rowSeqList
 */
const cancelRowElement = (self, rowIdxList, rowSeqList) => {

    // 키값 조회
    if(rowIdxList === null){
        rowIdxList = [];
        rowSeqList.forEach(rowSeq => rowIdxList.push(status.getSeqIndex(self, rowSeq)));
    }else if(rowSeqList === null){
        rowSeqList = [];
        rowIdxList.forEach(rowIdx => rowSeqList.push(status.setIdxSequence(self, rowIdx)));
    }

    let row = null;
    let data = reposit.getData(self);
    let cancelStyleName = null;
    let option = reposit.getOption(self);

    for(let i=0; i<rowIdxList.length; i++){
        row = status.getSeqRowElement(self, rowSeqList[i]);

        switch(data[rowIdxList[i]]._state){
        // 등록상태 취소(삭제)
        case constant.row.status.insert:
            deleter.removeRowElement(self, rowIdxList[i], rowSeqList[i]);
            break;
        // 편집상태 취소(편집의 경우 행 재생성)
        case constant.row.status.update:
            // 취소할 상태값 저장
            cancelStyleName = constant.class.row.update;
            break;
        // 삭제상태 취소
        case constant.row.status.remove:
            // 취소할 상태값 저장
            cancelStyleName = constant.class.row.remove;
            break;
        }

        if(option.body.state.use == true){
            // ROW스타일 row 태그 스타일 삭제            
            row.classList.remove(cancelStyleName);
        }
    }
}