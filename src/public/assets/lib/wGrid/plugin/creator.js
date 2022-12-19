import { util } from './util.js';
import { status } from "./status.js";

// 그리드 객체
let self = null;

// 객체 생성 시각
let isCreated = false;

/**
 * 그리드 최초 생성
 * @param {*} self 
 */
export const creator = {

    // 그리드 생성
    init: _self => {
        // grid객체 저장
        self = _self;
    },

    /**
     * 그리드 생성(최초 1회 실행)
     */
    create: () => isCreated === true ? refresh() : createGrid(),

    /**
     * 그리드 목록 재 생성
     */
    refresh: () => refresh()
}

/**
 * 그리드 생성
 */
const createGrid = () => {

    isCreated = true;

    // 헤더 생성
    if(self.option.head.is === true) createHead();

    // 바디 생성
    createBody();
    
    // // 데이터 없을 경우 표시 메시지 영역
    // if(this.option.empty.message) {
    //     this.element.bodyEmpty.textContent = this.option.empty.message;
    // }
    // this.element.bodyEmpty.classList.add('wgrid-empty-message');
    // this.emptyMessageDisply();
    // this.element.body.appendChild(this.element.bodyEmpty);

    // 페이징 영역 생성
    if(self.option.paging.is === true) createPagination();
}

/**
 * 
 */
const refresh = () => {

    // 그리드 상태 초기화
    self.state.seqIndex = {};
    self.state.idxSequence = {};
    self.state.seqRowElement = {};
    self.state.seqCellElement = {};
    // self.status.refresh();

    // 필드 비우기
    while(self.element.bodyTb.hasChildNodes()){
        self.element.bodyTb.removeChild(self.element.bodyTb.firstChild);
    }

    // 필드 재생성
    self.data.forEach((row, rIdx) => self.element.bodyTb.appendChild(createBodyRow(row, rIdx)));
}

/**
 * 그리드 생성 - 해더
 */
const createHead = () => {

    // 변수 정의
    let th = null, div = null, tag = null;
    util.elementEmpty(self.element.headTr);

    // 헤드영역 생성
    for(let i=0; i<self.fields.length; i++){

        let field = self.fields[i];

        // 태그생성
        th = document.createElement('th');
        div = document.createElement('div');

        // 헤더 테이블 내용 생성
        if(field.title){
            // 제목이 있는 경우 태그타입을 무시하고 제목 표시
            div.textContent = field.title;           
        }else if(field.element == 'checkbox'){
            // 체크박스 생성
            tag = document.createElement('input');
            tag.setAttribute('type', 'checkbox');
            tag.setAttribute('name', field.name);
            div.appendChild(tag);
        }else if(field.element == 'button'){
            // 버튼생성
            tag = document.createElement('button');
            tag.classList.add(self.constant.class.button);
            tag.setAttribute('name', field.name);
            tag.textContent = field.button.title;
            div.appendChild(tag);
        }else{
            // 제목적용
            tag = document.createElement('span');
            tag.textContent = field.title;
            div.appendChild(tag);
        }

        // 스타일 적용
        field.width ? th.style.width = field.width : null;
        div.style.textAlign = 'center';

        // 태그연결
        th.appendChild(div);
        self.element.headTr.appendChild(th);
    }
}

/**
 * 그리드 생성 - 바디
 */
const createBody = () => {

    // body 초기화
    util.elementEmpty(self.element.bodyTb);

    // ROW 생성
    self.data.forEach((item, idx) => self.element.bodyTb.appendChild(createBodyRow(item, idx)));
}

/**
 * 그리드 생성 - 바디 - 행
 * @param {*} row       행 엘리먼트
 * @param {*} rIdx      행 IDX
 */
const createBodyRow = (row, rIdx) => {

    // ROW 생성
    let tr = document.createElement('tr');
    tr.dataset.rowSeq = row._rowSeq;

    // 앞키 뒤값
    self.setSeqIndex(row._rowSeq, rIdx);
    self.setIdxSequence(rIdx, row._rowSeq);

    // 행 엘리먼트 인덱싱
    self.setSeqRowElement(row._rowSeq, tr);

    // CELL 생성        
    let loaded = [];
    self.fields.forEach((field, cIdx) => tr.appendChild(createBodyRowCell(row, rIdx, field, cIdx, loaded)));

    // ROW 커서 옵션 적용
    tr.style.cursor = self.option.row.style.cursor;

    // ROW 생성후 loaded함수 호출
    loaded.forEach(item => item.loaded(item.element, item.row));

    // 행 반환
    return tr;
}

/**
 * 그리드 생성 - 바디 - 행 - 열
 * @param {*} row 
 * @param {*} rIdx 
 * @param {*} cell 
 * @param {*} cIdx 
 * @param {*} loaded 
 */
const createBodyRowCell = (row, rIdx, cell, cIdx, loaded) => {

    // 생성할 태그 타입, 생성할 태그 변수들
    let type = null, tag = null, td = null, div = null, option = null; 

    // 태그생성
    td = document.createElement('td');
    div = document.createElement('div');

    // 태그 생성전 엘리먼트 타입 구분
    if(row._state == self.constant.STATE.INSERT || row._state == self.constant.STATE.UPDATE){
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
    if(type == 'checkbox'){
        // 체크박스 생성
        tag = document.createElement('input');
        tag.setAttribute('type', 'checkbox');
        tag.setAttribute('name', cell.name);
        if(self.option.checkbox.check == row[cell.name]){
            tag.checked = true;
        }else{
            tag.checked = false;
        }
        tag.dataset.sync = 'checkbox';
        div.appendChild(tag);
    }else if(type == 'button'){            
        // 버튼 생성
        tag = document.createElement('button');
        tag.classList.add('wgrid-btn');
        tag.setAttribute('name', cell.name);
        tag.textContent = cell.text;
        div.appendChild(tag);
    }else if(type == 'select'){
        // 셀릭트박스 생성
        tag = document.createElement('select');
        tag.classList.add('wgrid-select');            
        tag.classList.add('wgrid-wth100p');
        tag.setAttribute('name', cell.name);
        tag.dataset.sync = 'select';

        // 초기 빈값이 존재할 경우 추가
        if(cell?.data?.select?.empty){
            option = document.createElement('option');
            option.textContent = cell.data.select.empty;
            tag.appendChild(option);
        }

        // 셀릭트박스 옵션 태그 추가
        if(cell?.data?.select?.list){
            cell.data.select.list.forEach(item => {
                option = document.createElement('option');
                option.value = item[cell.data.select.value ? cell.data.select.value : 'value'];
                option.textContent = item[cell.data.select.text ? cell.data.select.text : 'text'];

                if(option.value == row[cell.name]){
                    option.selected = true;
                }

                tag.appendChild(option);
            });
        // 셀릭트박스 옵션 태그 추가(코드)
        }else if(cell?.data?.select?.codeList){
            cell.data.select.codeList.forEach(item => {
                option = document.createElement('option');
                option.value = item.code
                option.textContent = item.codeNm

                if(option.value == row[cell.name]){
                    option.selected = true;
                }

                tag.appendChild(option);
            });
        }
        div.appendChild(tag);
    // 날짜표시
    }else if(type == 'date'){
        tag = document.createElement('span');
        tag.textContent = row[cell.name];
        div.appendChild(tag);
    }else if(type == 'date-edit'){
        // 날짜 입력박스 표시
        tag = document.createElement('input');
        tag.classList.add('wgrid-input');
        tag.classList.add('wgrid-wth');
        tag.setAttribute('maxlength', 10);
        tag.setAttribute('name', cell.name);
        tag.dataset.sync = 'date';
        tag.value = row[cell.name];
        div.appendChild(tag);
    }else if(type == 'dateTime'){
        /* 개발중 */
    }else if(type == 'dateTime-edit'){
        /* 개발중 */
    }else if(type == 'text' || type == 'number' || !type){
        tag = document.createElement('span');
        tag.setAttribute('name', cell.name);
        // 코드맵핑
        if(cell.data && cell.data.mapping){
            tag.textContent = cell.data.mapping[row[cell.name]];
        }else{
            tag.textContent = row[cell.name];
        }
        div.appendChild(tag);
    }else if(type == 'text-edit'){
        // 입력내용 표시
        tag = document.createElement('input');
        tag.classList.add('wgrid-input');
        tag.classList.add('wgrid-wth-edit');
        tag.setAttribute('name', cell.name);
        tag.dataset.sync = 'text';
        tag.value = row[cell.name];
        div.appendChild(tag);
    }else if(type == 'number-edit'){
        tag = document.createElement('input');
        tag.classList.add('wgrid-input');
        tag.classList.add('wgrid-wth-edit');
        tag.setAttribute('name', cell.name);
        tag.setAttribute('maxlength', cell.maxlength ? cell.maxlength : 3);
        tag.dataset.sync = 'number';
        tag.value = row[cell.name];
        div.appendChild(tag);
    }

    // 텍스트, 날짜데이터가 비어있고 비어있을경우 표시하는 값이 정해지면 표시
    if((cell.emptyText && type == 'text' || type == 'dateTime' || type == 'date') 
        && !row[cell.name]){                    
        // 정의된 빈값 표시
        div.textContent = cell.emptyText;
    }
    
    // 셀 엘리먼트 인덱싱
    self.setSeqCellElement(row._rowSeq, cell.name, tag);

    // 태그연결
    td.appendChild(div);

    // 행 직후 콜백함수 호출 세팅
    if(cell.loaded){
        loaded.push({loaded: cell.loaded, element: tag, row: Object.assign({}, row)});
    } 

    // 스타일 적용
    cell.width ? td.style.width = cell.width : null;
    div.style.align = cell.align ? cell.align : 'center';
    return td;
}

/**
 * 그리드 생성 - 페이징
 */
const createPagination = () => {

    util.elementEmpty(self.element.pagination);

    self

    // TEST
    for(let i=0; i<10; i++){
        let btn = document.createElement('button');
        btn.textContent = i;
        self.element.pagination.appendChild(btn);
    }
}