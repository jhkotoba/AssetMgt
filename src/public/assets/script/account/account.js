import { postFetch } from "/script/common/fetch.js";

window.addEventListener('DOMContentLoaded', function(event){
    account.select();
});

// 계좌관리
const account = {
    data: {}
};

// 계좌목록 조회
account.select = async () => {
    account.data.acctList = await postFetch({url: '/account/getAccountList', body: {}});
};

// 계좌목록 그리드 선언
account.grid = new wGrid('account', {
    fields: [
        {title: null, element:'checkbox', name: 'check', edit: 'checkbox', width:'3%', align:'center'},
        {title:'번호', element: 'text', name: 'acctNo', width: '5%'},
        {title:'계좌번호', element: 'text', name: 'acctNum', edit: 'text', width: '16%'},
        {title:'계좌명', element: 'number', name: 'acctNm', edit: 'number', width: '16%'},
        {title:'은행', element: 'text', name: 'bankCd', edit:'select', width: '10%', data: {select:[]}},
        {title:'계좌순번', element: 'number', name: 'acctSeq', edit:'select', width: '12%'},
        {title:'등록자', element: 'text', name: 'insNo', width: '7%'},
        {title:'등록일시', element: 'text', name: 'insDttm', width: '12%'},
        {title:'수정자', element: 'text', name: 'uptNo', width: '7%'},
        {title:'수정일시', element: 'text', name: 'uptDttm', width: '12%'}                
    ],
    option: { 
        style: {
            height: 100, overflow: { y: 'scroll'}
        },
        body: { state: true },
        data: { insert: {acctNum: '', acctNm: '', bankCd:'', acctSeq: 0} }
    }
});


