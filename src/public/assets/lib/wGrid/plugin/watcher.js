/**
 * 그리드 상태관련 객체
 */
export const watcher = {

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
    clean: (self) => clean(self)
}

/**
 * 그리드 상태 세팅 생성
 * @param {*} self 
 */
const init = (self) => {
    // 그리드 상태값 생성
    self.state = {
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
    self.state.seqIndex = {};
    self.state.idxSequence = {};
    self.state.seqRowElement = {};
    self.state.seqCellElement = {};
}