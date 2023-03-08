import { sender } from "/script/common/sender.js";

window.addEventListener('DOMContentLoaded', () => user.init());
const user = {
    grid: null
};

// 사용자 목록 조회
user.search = async function(param){

    // 파라미터가 없을 경우 빈 객체 생성
    if(param === undefined) param = {};

    // 페이징 정보가 없을 경우 기본 페이징 세팅
    if(param.paging === undefined){
        param.paging = {pageNo: 1, pageSize: 20, pageBlock: 10, totalCount: 0}
    }

    // 사용자 목록 조회
    let response = await sender.request({url: '/system/getUserList', body: param});

    // 응답 성공 시
    if(response.resultCode == 'SUCCESS'){
        response.data.list.forEach(item => item.check = false);
        return response.data;
    // 응답 실패 시
    }else{
        console.error(response.message);
        alert(response.message);

        // 빈값 반환
        return {list:[], param:{}};
    }
}

// 사용자 목록 초기세팅
user.init = async function(){

    // 그리드 높이 설정
    let gridHeight = window.innerHeight - 294;

    this.grid = new wGrid('userList', {
        fields: [
            {title:'사용자번호', element: 'text', name: 'userNo', width: '5%'},
            {title:'사용자 아이디', element: 'text', name: 'userId', width: '18%'},
            {title:'이메일', element: 'text', name: 'email', width: '18%'},
            {title:'권한', element: 'text', name: 'authCd', width: '18%'},
            {title:'수정일시', element: 'text', name: 'uptDttm', width: '10%'},
            {title:'등록일시', element: 'text', name: 'insDttm', width: '10%'},
        ],
        option: {
            // 그리드 스타일 설정
            style: { height: gridHeight ? gridHeight : 635, overflow: {y: 'scroll'}},
            // 페이징 여부
            isPaging: true,
        },
        // 목록 조회함수 설정
        search: this.search,
    });

    // 조회 및 그리드 데이터 입력
    this.search().then(data => user.grid.setData(data.list, data.param));
}

user.select = async function(params){
    let response = await sender.request({
        url: '/system/getUserList',
        body: params
    });
    if(response.resultCode == 'SUCCESS'){
        return response.data;
    }else{
        alert(response.message);
    }
}

window._user = user;