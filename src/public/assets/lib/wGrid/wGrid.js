import { util } from "./plugin/util.js";
import { construct } from "./plugin/construct.js";


/**
 * wGrid
 * @author JeHoon 
 * @version 0.10.13
 */
 export class wGrid {

    // 생성자
    constructor(target, paramater){

        this.self = this;

        // 데이터 변수 생성 
        this.data = [];

        // 그리드 편집시 데이터 변수
        this.originData = {};
        
        // 필드저장
        this.fields = paramater.fields;

        // 유틸저장
        this.util = util.getUtils();

        // 외부 이벤트 연결
        this.outerEvent = paramater.event;

        // 엘리멘트 생성
        if(typeof target == 'string'){
            this.element = construct.createElement(target);
        }else{
            this.element = target;
        }

        // 그리드 상태값 생성
        this.state = construct.createState();

        // 상수세팅
        this.constant = construct.createConstant();

        // 옵션세팅
        this.option = construct.createOption(paramater);

        // 그리드 스타일세팅
        construct.settingGrid(this.element, paramater);

        // 내부 이벤트 생성        
        this.innerEvent = construct.createEvent(this, paramater);

        // 그리드 생성
        this.create();

        return this;
    }
     
    /**
     * 데이터 인덱싱
     * @param {string/number} rowSeq
     */
    dataReIndexing(rowSeq){

        // seqIndex 재 인덱싱
        this.state.seqIndex = [];
        this.data.forEach((item, index) => {
            this.state.seqIndex[item._rowSeq] = index;
        });

        // sequence가 키인 데이터 삭제
        if(rowSeq){
            delete this.state.seqRowElement[rowSeq];
            delete this.state.seqCellElement[rowSeq];
        }
    }

    /**
     * 그리드 생성
     */
    create = function(){
        // 헤더 생성
        if(this.option.head.show){
            this.createHead();
        }
        // 바디 생성
        this.createBody();
        
        // 데이터 없을 경우 표시 메시지 영역
        if(this.option.empty.message) {
            this.element.bodyEmpty.textContent = this.option.empty.message;
        }
        this.element.bodyEmpty.classList.add("wgrid-empty-message");
        this.emptyMessageDisply();
        this.element.body.appendChild(this.element.bodyEmpty);
    }

    /**
     * 그리드 헤더 생성
     */
    createHead = function(){
        // 변수 정의
        let th = null, div = null, tag = null;

        // 헤드영역 생성
        for(let i=0; i<this.fields.length; i++){

            let field = this.fields[i];

            // 태그생성
            th = document.createElement("th");
            div = document.createElement("div");

            // 헤더 테이블 내용 생성
            if(field.title){
                // 제목이 있는 경우 태그타입을 무시하고 제목 표시
                div.textContent = field.title;           
            }else if(field.element == "checkbox"){
                // 체크박스 생성
                tag = document.createElement("input");
                tag.setAttribute("type", "checkbox");
                tag.setAttribute("name", field.name);
                div.appendChild(tag);
            }else if(field.element == "button"){
                // 버튼생성
                tag = document.createElement("button");
                tag.classList.add("wgrid-btn");
                tag.setAttribute("name", field.name);
                tag.textContent = field.button.title;
                div.appendChild(tag);
            }else{
                // 제목적용
                tag = document.createElement("span");
                tag.textContent = field.title;
                div.appendChild(tag);
            }

            // 스타일 적용
            field.width ? th.style.width = field.width : null;
            div.style.textAlign = "center";

            // 태그연결
            th.appendChild(div);
            this.element.headTr.appendChild(th);
        }

        // 헤드 클래스 적용
        this.element.head.classList.add(this.constant.class.header);
        
        // 헤드 태그연결
        this.element.headTb.appendChild(this.element.headTr);
        this.element.head.appendChild(this.element.headTb);
        this.element.target.appendChild(this.element.head);
    }

    /**
     * 그리드 바디 생성
     */
    createBody = function(){

        // ROW 생성
        for(let i=0; i<this.data.length; i++){
            this.element.bodyTb.appendChild(
                this.createRow(this.data[i], i)
            );
        }

        // 바디 클래스 적용
        this.element.body.classList.add(this.constant.class.body);

        // 태그 연결
        this.element.body.appendChild(this.element.bodyTb);
        this.element.target.appendChild(this.element.body);
    }

    /**
     * 그리드 바디 행 생성
     * @param {object} row 
     * @param {number} idx 
     */
    createRow = function(row, idx){

        // ROW 생성
        let tr = document.createElement("tr");
        tr.dataset.rowSeq = row._rowSeq;

        // 앞키 뒤값
        this.setSeqIndex(row._rowSeq, idx);
		this.setIdxSequence(idx, row._rowSeq);

        // 행 엘리먼트 인덱싱
        this.setSeqRowElement(row._rowSeq, tr);

        // CELL 생성        
        let loaded = [];
        for(let i=0; i<this.fields.length; i++){

            // 행마다 세팅할 데이터 변수
            if(this.fields[i].element == "data"){
                switch(this.fields[i].type){
                case "array":
                    this.data[idx][this.fields[i].name] = new Array();
                    break;
                case "objcet":
                default:
                    this.data[idx][this.fields[i].name] = new Object();
                    break;
                }
            // 태그 행인 경우
            }else{
                tr.appendChild(this.createCell(row, idx, this.fields[i], i, loaded));
            }
        }

        // ROW 커서 옵션 적용
        if(this.option?.row?.style?.cursor){                
            tr.style.cursor = this.option.row.style.cursor;
        }

        // ROW 생성후 loaded함수 호출
        loaded.forEach(item => item.loaded(item.element, item.row));

        // 조회목록 없을시 메시지 표시
        this.emptyMessageDisply();

        return tr;
    }

    /**
     * 그리드 바디 행 셀 생성
     * @param {object} row 
     * @param {number} rIdx 
     * @param {object} cell 
     * @param {number} cIdx 
     * @param {object} loaded 그리드 하나의 생성이 진행이 완료된 후 콜백함수 저장 리스트
     * @returns 
     */
    createCell = function(row, rIdx, cell, cIdx, loaded){

        // 생성할 태그 타입, 생성할 태그 변수들
        let type = null, tag = null, td = null, div = null, option = null; 

        // 태그생성
        td = document.createElement("td");
        div = document.createElement("div");

        // 태그 생성전 엘리먼트 타입 구분
        if(row._state == this.constant.STATE.INSERT || row._state == this.constant.STATE.UPDATE){
            if(cell.edit){
                if(cell.edit == 'text') type = 'text-edit';
                else if(cell.edit == 'number') type = 'number-edit';
                else if(cell.edit == 'date') type = 'date-edit';
                else if(cell.edit == 'dateTime') type = 'dateTime-edit';
                else type = cell.edit;
            }else{
                type = cell.element;
            }
        }else{
            type = cell.element;
        }

        // 태그 생성
        if(type == "checkbox"){
            // 체크박스 생성
            tag = document.createElement("input");
            tag.setAttribute("type", "checkbox");
            tag.setAttribute("name", cell.name);
            if(this.option.checkbox.check == row[cell.name]){
                tag.checked = true;
            }else{
                tag.checked = false;
            }
            tag.dataset.sync = "checkbox";
            div.appendChild(tag);
        }else if(type == "button"){            
            // 버튼 생성
            tag = document.createElement("button");
            tag.classList.add("wgrid-btn");
            tag.setAttribute("name", cell.name);
            tag.textContent = cell.text;
            div.appendChild(tag);
        }else if(type == "select"){
            // 셀릭트박스 생성
            tag = document.createElement("select");
            tag.classList.add("wgrid-select");            
            tag.classList.add("wgrid-wth100p");
            tag.setAttribute("name", cell.name);
            tag.dataset.sync = "select";

            // 초기 빈값이 존재할 경우 추가
            if(cell.data && cell.data.select && cell.data.select.empty){
                option = document.createElement("option");
                option.textContent = cell.data.select.empty;
                tag.appendChild(option);
            }

            // 셀릭트박스 옵션태그 추가
            if(cell.data && cell.data.select && cell.data.select.list){
                cell.data.select.list.forEach(item => {
                    option = document.createElement("option");
                    option.value = item[cell.data.select.value ? cell.data.select.value : "value"];
                    option.textContent = item[cell.data.select.text ? cell.data.select.text : "text"];

                    if(option.value == row[cell.name]){
                        option.selected = true;
                    }

                    tag.appendChild(option);
                });
            }
            div.appendChild(tag);
        // 날짜표시
        }else if(type == "date"){
            tag = document.createElement("span");
            tag.textContent = row[cell.name];
            div.appendChild(tag);
        }else if(type == "date-edit"){
            // 날짜 입력박스 표시
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth");
            tag.setAttribute("maxlength", 10);
            tag.setAttribute("name", cell.name);
            tag.dataset.sync = "date";
            tag.value = row[cell.name];
            div.appendChild(tag);
        }else if(type == "dateTime"){
            /* 개발중 */
        }else if(type == "dateTime-edit"){
            /* 개발중 */
        }else if(type == 'text' || type == 'number' || !type){
            tag = document.createElement("span");
            tag.setAttribute("name", cell.name);
            // 코드맵핑
            if(cell.data && cell.data.mapping){
                tag.textContent = cell.data.mapping[row[cell.name]];
            }else{
                tag.textContent = row[cell.name];
            }
            div.appendChild(tag);
        }else if(type == "text-edit"){
            // 입력내용 표시
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth-edit");
            tag.setAttribute("name", cell.name);
            tag.dataset.sync = "text";
            tag.value = row[cell.name];
            div.appendChild(tag);
        }else if(type == 'number-edit'){
            tag = document.createElement("input");
            tag.classList.add("wgrid-input");
            tag.classList.add("wgrid-wth-edit");
            tag.setAttribute("name", cell.name);
            tag.setAttribute("maxlength", cell.maxlength ? cell.maxlength : 3);
            tag.dataset.sync = "number";
            tag.value = row[cell.name];
            div.appendChild(tag);
        }

        // 텍스트, 날짜데이터가 비어있고 비어있을경우 표시하는 값이 정해지면 표시
        if((cell.emptyText && type == "text" || type == "dateTime" || type == "date") 
            && !row[cell.name]){                    
            // 정의된 빈값 표시
            div.textContent = cell.emptyText;
        }
        
        // 셀 엘리먼트 인덱싱
        this.setSeqCellElement(row._rowSeq, cell.name, tag);

        // 태그연결
        td.appendChild(div);

        // 행 직후 콜백함수 호출 세팅
        if(cell.loaded){
            loaded.push({loaded: cell.loaded, element: tag, row: Object.assign({}, row)});
        } 

        // 스타일 적용
        cell.width ? td.style.width = cell.width : null;
        div.style.align = cell.align ? cell.align : "center";
        return td;
    }

    /**
     * 그리드 데이터 가져오기
     * @returns 
     */
    getData = function(){
        return JSON.parse(JSON.stringify(this.data));
    }

    /**
     * 데이터 추가
     * @param {object} paramater 
     */
    setData = function(paramater){

        let list = [];

        // 배열
        if(typeof paramater == 'object' && typeof paramater.length == 'number'){
            list = paramater;
        // 객체
        }else if(typeof paramater == 'object' && typeof paramater.length == 'undefined'){
            list = paramater.list;
            isRefresh = paramater.isRefresh;
        }else {
            console.error('setData paramater error:', typeof paramater, paramater);
        }

        // 데이터를 그리드에 삽입
        for(let item of list){
            // 기본 데이터 세팅
            item._rowSeq = this.getNextSeq();
            item._state = this.constant.STATE.SELECT;
        }

        // 데이터 저장
        this.data = list;

        // 필드 새로고침
        this.refresh();
    }

    /**
     * 그리드 새로고침 (필드부분 재생성)
     */
    refresh = function(){

        // 그리드 상태 초기화
        this.state.seqIndex = {};
        this.state.idxSequence = {};
        this.state.seqRowElement = {};
        this.state.seqCellElement = {};

        // 필드 비우기
        while(this.element.bodyTb.hasChildNodes()){
            this.element.bodyTb.removeChild(this.element.bodyTb.firstChild);
        }
        // 필드 재생성
        this.data.forEach((row, rIdx) => this.element.bodyTb.appendChild(this.createRow(row, rIdx)));

        // 조회목록 없을시 메시지 표시
        this.emptyMessageDisply();
    }

    /**
     * 그리드 초기화
     */
    empty = function(){
        this.data = [];
        this.refresh();
    }

    /**
     * 신규행 추가
     * @returns 
     */
    createNewRow = function(){

        // 신규행 ROW 데이터 세팅
        let row = {
            _rowSeq: this.getNextSeq(),
            _state: this.constant.STATE.INSERT
        };

        // 신규행 기본값 설정되어있으면 세팅
        if(this.option.data.insert){
            for(let key in this.option.data.insert){
                row[key] = this.option.data.insert[key];
            }
        }

        // 필드값 세팅
        for(let field of this.fields){
            
            // 신규행 추가시 기본값 세팅
            switch(field.element){
            case 'text': case 'select': default:
                row[field.name] = "";
                break;
            case 'number':
                row[field.name] = 0;
                break;
            case 'checkbox':
                row[field.name] = this.option.checkbox.check;
                break;
            }

            // 해당 행에 셀렉트박스 데이터가 있는 경우, 셀렉트박스 empty값이 없거나 false일 경우
            if(field.data && field.data.select 
                && (!field.data.select.empty || field.data.select === false)
                && field.data.select.list.length > 0){

                if(field.data.select.value){
                    row[field.name] = field.data.select.list[0][field.data.select.value];
                }else{
                    row[field.name] = field.data.select.list[0].value;
                }
            }
        }

        // 신규 데이터 추가
        this.data.push(row);

        // 신규행 추가
        let tr = this.createRow(row, this.data.length-1);

        if(this.option.body.state.use == true){
            tr.classList.add(this.constant.class.insert);
        }
        
        return tr;
    }

    /**
     * 그리드 시퀀스 값으로 데이터 인덱스 구하기
     * @param {string/number} rowSeq 
     * @returns 
     */
    getDataRowSeq = rowSeq => this.data[this.getSeqIndex(rowSeq)];
    
    /**
     * 그리드 인자의 인덱스에 해당되는 데이터 가져오기
     * @param {number} index 
     * @returns 
     */
    getDataIndex = index => this.data[index];

    /**
     * 상태가 조회(SELECT)인 데이터 가져오기
     * @returns 
     */
    getSelectData = () => this.data.filter(item => this.isSelect(item._state));

    /**
     * 상태가 추가(INSERT)인 데이터 가져오기
     * @returns 
     */
    getInsertData = () => this.data.filter(item => this.isInsert(item._state))

    /**
     * 상태가 수정(UPDATE)인 데이터 가져오기
     * @returns 
     */
    getUpdateData = () => this.data.filter(item => this.isUpdate(item._state));

    /**
     * 상태가 삭제(DELETE)인 데이터 가져오기
     * @returns 
     */
    getDeleteData = () => this.data.filter(item => this.isDelete(item._state));
    
    /**
     * 상태가 변경(INSERT, UPDATE, DELETE)인 데이터 가져오기
     * @returns 
     */
    getApplyData = () => this.data.filter(item => !this.isSelect(item._state));

    /**
     * 현재 시퀀스 가져오기
     * @returns 
     */
    getCurSeq = () => this.state.curSeq;

    /**
     * 다음시퀀스 가져오기(시퀀스 증가)
     * @returns 
     */
    getNextSeq = () => ++this.state.curSeq;

    /**
     * 그리드 타켓 엘리멘트 가져오기
     * @returns 
     */
    getElementTarget = () => this.element.target;

    /**
     * 그리드 헤드 엘리먼트 가져오기
     * @returns 
     */
    getElementHead = () => this.element.head;

    /**
     * 그리드 헤드 테이블 엘리먼트 가져오기
     * @returns 
     */
    getElementHeadTable = () => this.element.headTb;

    /**
     * 그리드 헤드 행 엘리먼트 가져오기
     * @returns 
     */
    getElementHeadTableRow = () => this.element.headTr;

    /**
     * 그리드 바디 엘리먼트 가져오기
     * @returns 
     */
    getElementBody = () => this.element.body;

    /**
     * 그리드 바디 테이블 엘리먼트 가져오기
     * @returns
     */
    getElementBodyTable = () => this.element.bodyTb;
    
    /**
     * key:sequence value: index 인덱싱 push
     * @param {string} sequence 
     * @param {string} index 
     */
	setSeqIndex = (sequence, index) => this.state.seqIndex[sequence] = index;
		
    /**
     * 시퀀스번호로 데이터의 index 가져오기
     * @param {string} sequence 
     * @returns 
     */
	getSeqIndex = sequence => this.state.seqIndex[sequence];
		
    /**
     * key:index value: sequence 인덱싱 push
     * @param {string} index 
     * @param {string} sequence 
     */
	setIdxSequence = (index, sequence) => this.state.idxSequence[index] = sequence;
		
    /**
     * index로 시퀀스번호 가져오기
     * @param {string} index 
     * @returns 
     */
	getIdxSequence = (index) => this.state.idxSequence[index];

    /**
     * 그리드 행 엘리먼트 인덱싱
     * @param {string} sequence 
     * @param {element} element 
     * @returns 
     */
    setSeqRowElement = (sequence, element) => this.state.seqRowElement[sequence] = element;

    /**
     * 그리드 행 엘리먼트 가져오기
     * @param {*} sequence 
     * @returns 
     */
    getSeqRowElement = sequence => this.state.seqRowElement[sequence];

    /**
     * 그리드 셀 엘리먼트 인덱싱
     * @param {string} sequence 
     * @param {string} name 
     * @param {element} element 
     * @returns 
     */
    setSeqCellElement(sequence, name, element) {
        if(!this.state.seqCellElement[sequence]) this.state.seqCellElement[sequence] = {};
        this.state.seqCellElement[sequence][name] = element;
    }

    /**
     * 그리드 셀 엘리먼트 가져오기
     * @param {string/number} sequence 
     * @param {string} name 
     * @returns 
     */
    getSeqCellElement = (sequence, name) => this.state.seqCellElement[sequence][name];
   
    /**
     * 신규행 추가(위에서)
     */
    prependRow = () => this.element.bodyTb.insertBefore(this.createNewRow(), this.element.bodyTb.firstChild);

    /**
     * 신규행 추가(아래에서)
     */
    appendRow = () => this.element.bodyTb.appendChild(this.createNewRow());

    /**
     * 최상위 rowElement 반환
     * @returns
     */
    getFirstRowElement = () => this.getSeqRowElement(this.getIdxSequence(0));

    /**
     * 최상위 rowSeq 반환
     * @returns
     */
    getFirstRowSeq = () => this.getFirstRowElement().dataset.rowSeq;

    /**
     * rowSeq 값으로 행 엘리먼트 가져오기
     * @param {string/number} rowSeq 
     * @returns 
     */    
    getRowElementRowSeq = rowSeq => this.getSeqRowElement(rowSeq);

     /**
     * name값으로 체크된 체크박스된 엘리먼트 가져오기
     * @param {string} name 
     * @returns
     */
    getCheckedElement = name => Object.entries(this.state.seqCellElement)
        .filter(f => f[1][name].checked == true)
        .flatMap(fm => fm[1][name]);

    /**
     * name값으로 body 체크박스 전체 선택/해제
     * @param {string} name 
     * @param {boolean} bool 
     * @returns 
     */
    setAllChecked = (name, bool) => {
        for(let seq in this.state.seqCellElement){
            this.state.seqCellElement[seq][name].checked = bool;
            this.data[this.getSeqIndex(seq)][name] = 
                bool == true ? this.option.checkbox.check : this.option.checkbox.uncheck;
        }
    }

    /**
     * name값으로 체크된 체크박스 seq(list)번호 가져오기
     * @param {string} name 
     * @returns 
     */
    getNameCheckedSeqs = (name) => {
        let seqList = [];
        this.getCheckedElement(name)
            .forEach(check => {
                seqList.push(Number(this.util.getTrNode(check).dataset.rowSeq));
            });
        return seqList;
    }

    /**
     * name값으로 체크된 체크박스 행 데이터(itemList) 가져오기
     * @param {string} name 
     * @returns 
     */
    getNameCheckedItems = name => {
        let itemList = [];
        this.getCheckedElement(name)
            .forEach(check => {
                itemList.push(this.getDataIndex(this.getSeqIndex(this.util.getTrNode(check).dataset.rowSeq)));
            });
        return Object.assign([], itemList);
    }

    /**
     * 옵션변경
     * @param {*} optionName 
     * @param {*} value 
     * @returns 
     */
    chageOption = (optionName, value) => eval(`this.${optionName}=` + value);

    /**
     * 행의 변경상태를 체크 (index)
     * @param {number} rowIdx 
     * @returns 
     */
    isModifyDataRowIdx(rowIdx){
        return this.isModifyData(rowIdx, this.getIdxSequence(rowIdx));
    }

    /**
     * 행의 변경상태를 체크 (sequence)
     * @param {string/number} rowSeq 
     * @returns 
     */
    isModifyDataRowSeq(rowSeq){
        return this.isModifyData(this.getSeqIndex(rowSeq), rowSeq);
    }
    
    /**
     * 행의 변경상태를 체크
     * @param {number} rowIdx 
     * @param {string/number} rowSeq 
     * @returns 
     */
    isModifyData(rowIdx, rowSeq){
        let result = false;
        for(let key in this.data[rowIdx]){
            if(key.indexOf("_") != 0 
                && this.data[rowIdx][key] != this.originData[rowSeq][key]){
                result = true;
                break;
            }
        }
        return result;
    }

    /**
     * 선택한 체크박스의 행을 편집,삭제 상태로 부터 복원
     * @param {string} name 
     * @returns 
     */
    cancelStateCheckedElement = name => this.cancelStateRowSeqs(this.getNameCheckedSeqs(name));

    /**
     * 행을 편집,삭제 상태로 부터 복원 (rowIdxList)
     * @param {Array} rowIdxList 
     */
    cancelStateRowIdxs = rowIdxList => rowIdxList.forEach(idx => this.cancelStateRowIdx(idx));

    /**
     * 행을 편집,삭제 상태로 부터 복원 (rowSeqList)
     * @param {Array} rowSeqList 
     */
    cancelStateRowSeqs = rowSeqList => rowSeqList.forEach(req => this.cancelStateRowSeq(req));

    /**
     * 행을 편집,삭제 상태로 부터 복원 (rowIdx)
     * @param {number} rowIdx 
     */
    cancelStateRowIdx = rowIdx => this.cancelStateRow(rowIdx, this.getIdxSequence(rowIdx));

    /**
     * 행을 편집,삭제 상태로 부터 복원 (rowSeq)
     * @param {number} rowSeq 
     */
    cancelStateRowSeq = rowSeq => this.cancelStateRow(this.getSeqIndex(rowSeq), rowSeq);

    /**
     * 행의 상태를 취소(삭제, 편집상태를 취소)
     * @param {number} rowIdx 
     * @param {number} rowSeq 
     */
    cancelStateRow(rowIdx, rowSeq){
        var cancelTr = null;

        // 변경할 행 엘리먼트
        let tr = this.getRowElementRowSeq(rowSeq);
        
        switch(this.data[rowIdx]._state){
        // 등록상태 취소(삭제)
        case this.constant.STATE.INSERT:
            this.removeRow(rowIdx, rowSeq);
            break;
        // 편집상태 취소(편집의 경우 행 재생성)
        case this.constant.STATE.UPDATE:
            
            // 원본 데이터로 돌림
            for(let key in this.originData[rowSeq]){
                this.data[rowIdx][key] = this.originData[rowSeq][key];
            }
            delete this.originData[rowSeq];

            // 데이터 상태 조회로 변경
            this.data[rowIdx]._state = this.constant.STATE.SELECT;

            // 자식노드 비우기
            this.util.childElementEmpty(tr);

            // cell 생성후 태그 연결
            let loaded = [];
            this.fields.forEach((field, idx) => tr.appendChild(this.createCell(this.data[rowIdx], rowIdx, field, idx, loaded)));
            // 행생성후 loaded함수 호출
            loaded.forEach(item => item.fn(item.tag, item.row));

            // 취소할 상태값 저장
            cancelTr = this.constant.class.update;
            break;
        // 삭제상태 취소
        case this.constant.STATE.REMOVE:

            // 데이터 상태 조회로 변경
            this.data[rowIdx]._state = this.constant.STATE.SELECT;
            
            // 취소할 상태값 저장
            cancelTr = this.constant.class.remove;
            break;
        }

        if(this.option.body.state.use == true){
            // ROW스타일 row 태그 스타일 삭제            
            tr.classList.remove(cancelTr);
        }
    }

    /**
     * 선택한 체크박스의 행을 편집상태로 변환
     * @param {string} name 
     */
    modifyStateCheckedElement = name => this.modifyStateRowSeqs(this.getNameCheckedSeqs(name));

    /**
     * 행 편집상태로 변경 (rowIdxList)
     * @param {Array} rowIdxList 
     */
    modifyStateRowIdxs = rowIdxList => rowIdxList.forEach(idx => this.modifyStateRowIdx(idx));

    /**
     * 행 편집상태로 변경(rowSeqList)
     * @param {Array} rowSeqList 
     */
    modifyStateRowSeqs = rowSeqList => rowSeqList.forEach(req => this.modifyStateRowSeq(req));

    /**
     * 행 편집상태로 변경 (rowIdx)
     * @param {number} rowIdx 
     */
    modifyStateRowIdx = rowIdx => this.modifyStateRow(rowIdx, this.getIdxSequence(rowIdx));
    
    /**
     * 행 편집상태로 변경 (seq)
     * @param {string/number} rowSeq 
     */
    modifyStateRowSeq = rowSeq => this.modifyStateRow(this.getSeqIndex(rowSeq), rowSeq);

    // 행 편집상태로 변경   
    modifyStateRow(rowIdx, rowSeq){

        // 편집할 행 엘리먼트
        let tr = this.getRowElementRowSeq(rowSeq);
        
        // 이전상태 분기처리
        switch(this.data[rowIdx]._state){
        case this.constant.STATE.INSERT: 
        case this.constant.STATE.UPDATE:
            return;
        case this.constant.STATE.REMOVE:
            // 삭제 상태에서 편집 상태로 변경시 행 상태 원복 진행
            this.cancelStateRow(rowIdx, rowSeq);
            break;
        }
       
        // 편집모드 변경전 본래값 저장
        this.originData[rowSeq] = {};
        for(let key in this.data[rowIdx]){
            this.originData[rowSeq][key] = this.data[rowIdx][key];
        }        

        // 데이터 행상태 값 변경
        this.data[rowIdx]._state = this.constant.STATE.UPDATE;

        // 자식노드 비우기
        this.util.childElementEmpty(tr);

        // CELL 생성        
        let loaded = [];
        this.fields.forEach((field, idx) => tr.appendChild(this.createCell(this.data[rowIdx], rowIdx, field, idx, loaded)));
        
        // 행생성후 loaded함수 호출
        loaded.forEach(item => item.fn(item.tag, item.row));

        if(this.option.body.state.use == true){
            tr.classList.add(this.constant.class.update);
        }
    }

    /**
     * 선택한 체크박스의 행을 삭제상태로 변환
     * @param {string} name 
     */
    removeStateCheckedElement = name => this.removeStateRowSeqs(this.getNameCheckedSeqs(name));

    /**
     * 행 삭제상태로 변경 (rowIdxList)
     * @param {Array} rowIdxList 
     * @returns 
     */
    removeStateRowIdxs = rowIdxList => rowIdxList.forEach(idx => this.removeStateRowIdx(idx));    

    /**
     * 행 삭제상태로 변경 (rowSeqList)
     * @param {Array} rowSeqList 
     * @returns 
     */
    removeStateRowSeqs = rowSeqList => rowSeqList.forEach(req => this.removeStateRowSeq(req));

    /**
     * 행 삭제상태로 변경 (rowIdx)
     * @param {number} rowIdx 
     * @returns 
     */
    removeStateRowIdx = rowIdx => this.removeStateRow(rowIdx, this.getIdxSequence(rowIdx));    

    /**
     * 행 삭제상태로 변경 (rowSeq)
     * @param {string/number} rowSeq 
     * @returns 
     */
    removeStateRowSeq = rowSeq => this.removeStateRow(this.getSeqIndex(rowSeq), rowSeq);
   
    /**
     *  행 삭제상태로 변경
     * @param {number} rowIdx 
     * @param {string/number} rowSeq 
     */
    removeStateRow(rowIdx, rowSeq){        

        let tr = this.getRowElementRowSeq(rowSeq);

        // 이전상태 분기처리
        switch(this.data[rowIdx]._state){
        case this.constant.STATE.INSERT:
             // 신규행 제거
             this.removeRow(rowIdx, rowSeq);
        case this.constant.STATE.REMOVE:
            return;
        case this.constant.STATE.UPDATE:
            // 삭제 상태에서 편집 상태로 변경시 행 상태 원복 진행
            this.cancelStateRow(rowIdx, rowSeq);
            break;
        }

        if(this.option.body.state.use == true){
            tr.classList.add(this.constant.class.remove);
        }

        this.data[rowIdx]._state = this.constant.STATE.REMOVE;

        // 조회목록 없을시 메시지 표시
        this.emptyMessageDisply();
    }

    /**
     * 한개의 행 삭제 (rowIdx)
     * @param {number} rowIdx 
     */
    removeRowIdx = rowIdx => this.removeRow(rowIdx, this.getIdxSequence(rowIdx));

    /**
     * 한개의 행 삭제 (rowSeq)
     * @param {string/number} rowSeq 
     */
    removeRowSeq = rowSeq => this.removeRow(this.getSeqIndex(rowSeq), rowSeq);

    /**
     * 한개의 행 삭제
     * @param {number} rowIdx 
     * @param {string/number} rowSeq 
     */
    removeRow(rowIdx, rowSeq){

        // 데이터 삭제
        this.data.splice(rowIdx, 1);

        // 엘리먼트 삭제
        this.getRowElementRowSeq(rowSeq).remove();

        // 데이터 재 인덱싱
        this.dataReIndexing(rowSeq);

        // 조회목록 없을시 메시지 표시
        this.emptyMessageDisply();
    }

    /**
     * 목록데이터가 있음/없음에 따라서 메시지 표시/숨기기
     * @returns 
     */
    emptyMessageDisply = () => this.data < 1 
        ? this.emptyMessageShow(true) 
        : this.emptyMessageShow(false);

    /**
     * 그리드 목록 0건인경우 표시되는 메시지 표시/숨기기
     * @param {boolean} bool 
     * @returns 
     */
    emptyMessageShow = bool => bool 
        ? this.element.bodyEmpty.classList.remove("wgrid-hide")
        : this.element.bodyEmpty.classList.add("wgrid-hide");

    // 상태체크 SELECT
    isSelect = state => this.constant.STATE.SELECT === state;
    // 상태체크 INSERT
    isInsert = state => this.constant.STATE.INSERT === state;
    // 상태체크 UPDATE
    isUpdate = state => this.constant.STATE.UPDATE === state;
    // 상태체크 REMOVE
    isRemove = state => this.constant.STATE.REMOVE === state;
}
window.wGrid = wGrid;