import { sender } from "/script/common/sender.js";

window.addEventListener('DOMContentLoaded', function(event){
    account.search();
});

// 계좌목록 그리드 선언
const account = new wGrid('account', {
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
        isPaging: true,
        style: {
            height: 100, overflow: { y: 'scroll'}
        },
        data: { insert: {acctNum: '', acctNm: '', bankCd:'', acctSeq: 0} }
    },
    search: async (params) => {

        // 기본값 세팅
        if(params === undefined) params = {};
        if(params.paging === undefined){
            params.paging = {pageNo: 1, pageSize: 10, pageBlock: 10, totalCount: 0};
        }

        // 계좌목록 조회
        let response = await sender.request({url: '/account/getAccountList', body: params});

        // 응답 성공 시
        if(response.resultCode == 'SUCCESS'){
            response.data.list.forEach(item => item.check = false);
            return response.data;
        // 응답 실패 시
        }else{
            console.error(response.message);
            alert(response.message);
            // 빈값 반환
            return {list:[], params:{}};
        }
    }
});


