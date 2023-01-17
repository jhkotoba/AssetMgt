import { util } from './util.js';
import { constant } from "./constant.js";
import { reposit } from "./reposit.js";
import { status } from "./status.js";
import { creator } from "./creator.js";
import { canceler } from "./canceler.js";



/**
 * 그리드 삭제 관련 객체
 */
export const deleter = {

    /**
     * 그리드 삭제 관련 객체 초기설정
     * @param {*} self
     * @returns 
     */
    init: (self) => init(self),

    


    /**
     * 삭제 상태로 변경(index)
     * @param {*} self
     * @param {number/string}                   행 IDX
     * @param {boolean} option.isDisabled       비활성화 여부(기본값 true)
     * @param {array} option.exceptDisabledList 비활성화 제외 항목
     */
    removeRowIdx: (self, rowIdx, option) => removeRow(self, rowIdx, status.getIdxSequence(self, rowIdx), option),

    /**
     * 삭제 상태로 변경(sequence)
     * @param {*} self
     * @param {number/string}                   행 시퀀스
     * @param {boolean} option.isDisabled       비활성화 여부(기본값 true)
     * @param {array} option.exceptDisabledList 비활성화 제외 항목
     */
    removeRowSeq: (self, rowSeq, option) => removeRow(self, status.getSeqIndex(self, rowSeq), rowSeq, option),


    /**
     * 삭제 상태로 변경
     * @param {*} self
     * @param {number} rowIdx     행 IDX
     * @param {number} rowSeq     행 시퀀스
     * @param {*} option          설정값
     * @param {array} option.exceptDisabledList 비활성화 제외 항목
     */
    removeRow: (self, rowIdx, rowSeq, option) => removeRow(self, rowIdx, rowSeq, option),

    /**
     * 선택한 체크박스의 행을 삭제상태로 변환
     * @param {*} self
     * @param {string} name 필드명
     * @returns 
     */
    removeRowCheckedElement: (self, name) => removeRowElement(self, null, status.getNameCheckedSeqs(self, name)),

    removeRowElementRowIdxs: (self, rowIdxList) => removeRowElement(self, rowIdxList, null),

    removeRowElementRowSeqs: (self, rowSeqList) => removeRowElement(self, null, rowSeqList),

    removeRowElementRowIdx: (self, rowIdx) => removeRowElement(self, [rowIdx], null),

    removeRowElementRowSeq: (self, rowSeq) => removeRowElement(self, null, [rowSeq]),

    removeRowElement: (self, rowIdx, rowSeq) => removeRowElement(self, [rowIdx], [rowSeq]),

    deleteRowIdx: (self, rowIdx) => deleteRow(self, rowIdx, status.getIdxSequence(self, rowIdx)),


    deleteRowSeq: (self, rowIdx) => deleteRow(self, status.getSeqIndex(self, rowSeq), rowSeq),


    deleteRow: (self, rowIdx, rowSeq) => deleteRow(self, rowIdx, rowSeq),


}

/**
 * 
 * @param {*} self 
 */
const init = (self) => {}

/**
 * 삭제 상태로 변경
 * @param {*} self
 * @param {number} rowIdx                   행 IDX
 * @param {number} rowSeq                   행 시퀀스
 * @param {boolean} option.isDisabled       비활성화 여부(기본값 true)
 * @param {array} option.exceptDisabledList 비활성화 제외 항목
 */
const removeRow = (self, rowIdx, rowSeq, option) => {

    // 데이터 행상태 값 변경
    reposit.getData(self, rowIdx)._state = constant.row.status.remove;

    // Disabled 여부 확인
    if(option?.isDisabled !== false){

        // Disabled 처리
        for(let field of reposit.getFields(self)){

            // Disabled 제외 항목이 아닌 경우만 비활성화 처리
            if((option?.exceptDisabledList?.length > 0 ? option.exceptDisabledList : []).includes(field.name) == false){
                status.getSeqCellElement(self, rowSeq, field.name).disabled = true;
            }
        }
    }
    
    // 행 삭제상태(색상) 변환
    if(self.option.isRowStatusColor == true){
        status.getSeqRowElement(self, rowSeq)
            .classList.add(constant.class.row.remove);
    }
}

const removeRowElement = (self, rowIdxList, rowSeqList) => {

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
    let rowIdx = null;
    let rowSeq = null;

    for(let i=0; i<rowIdxList.length; i++){

        rowIdx = rowIdxList[i];
        rowSeq = rowSeqList[i];
        row = status.getSeqRowElement(self, rowSeqList[i]);

        switch(data[rowIdx]._state){
        // 신규행 제거
        case constant.row.status.insert:
            deleteRow(rowIdx, rowSeqList[i]);
            break;
        // 삭제 상태에서 편집 상태로 변경시 행 상태 원복 진행
        case constant.row.status.update:
            // 취소할 상태값 저장
            canceler.cancelRowElement(self, rowIdx, rowSeq);
            break;
        // 미동작
        case constant.row.status.remove:
            break;
        }

        // ROW스타일 row 태그 스타일 삭제
        if(self.option.isRowStatusColor == true){
            row.classList.add(constant.class.row.remove);
        }

        data[rowIdx]._state = constant.row.status.remove;
    }


    // let tr = status.getSeqRowElement(self, rowSeq);
    // let data = reposit.getData(self);
    // console.log('data:', data, rowIdx);

    // // 이전상태 분기처리
    // switch(data[rowIdx]._state){
    // case constant.row.status.insert:
    //     // 신규행 제거
    //     deleteRow(rowIdx, rowSeq);
    // case constant.row.status.remove:
    //     return;
    // case constant.row.status.update:
    //     // 삭제 상태에서 편집 상태로 변경시 행 상태 원복 진행
    //     canceler.cancelRow(self, rowIdx, rowSeq);
    //     break;
    // }

    // if(reposit.getOption(self).body.state.use == true){
    //     tr.classList.add(constant.class.row.remove);
    // }

    // data[rowIdx]._state = constant.row.status.remove;
}

const deleteRow = (self, rowIdx, rowSeq) => {

    // 데이터 삭제
    reposit.getData(self).splice(rowIdx, 1);

    // 엘리먼트 삭제
    status.getSeqRowElement(self, rowSeq).remove();

    // 데이터 재 인덱싱
    status.dataReIndexing(self, rowSeq);

}