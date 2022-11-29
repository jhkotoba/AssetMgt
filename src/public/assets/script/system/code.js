import { postFetch } from "/script/common/fetch.js";

window.addEventListener('DOMContentLoaded', () => code.init());

// 코드 객체
const code = {};
code.data = {};

code.init = async function(){
    try{
        this.data.code = await this.selectCode();
        this.createGrid();
        this.grid.setData(JSON.parse(JSON.stringify(this.data.code)));
    }catch(err){
        console.error(err);
    }
}

// 공통코드 조회
code.selectCode = async function(){
    let response = await postFetch({url: '/system/getCodeList', body: {}});
    if(response.resultCode == 'SUCCESS'){
        return response.data;
    }else{
        throw new Error(res.message);
    }
};

// 코드목록 생성
code.createGrid = function(){
    this.grid = new wGrid('commonCode', {
        fields: [
            {title: null, element:'checkbox', name: 'check', edit: 'checkbox', width:'3%', align:'center'},
            {title:'코드', element: 'text', name: 'code', width: '5%', maxlength: 50},
            {title:'코드명', element: 'text', name: 'codeNm', edit: 'text', width: '18%', maxlength: 100},
            {title:'그룹코드', element: 'text', name: 'groupCd', edit: 'text', width: '26%', maxlength: 50},
            {title:'사용여부', element: 'number', name: 'useYn', edit: 'number', width: '5%'},
            {title:'등록자', element: 'text', name: 'insNo', width: '5%'},
            {title:'등록일시', element: 'text', name: 'insDttm', width: '10%'},
            {title:'수정자', element: 'text', name: 'uptNo', width: '5%'},
            {title:'수정일시', element: 'text', name: 'uptDttm', width: '10%'},
        ],
        option: { 
            style: { height: 100, overflow: { y: 'scroll'}},
            data: { insert: {code: '', codeNm: '', bankCd:'', useYn: 'Y'} }
        }
    });
}