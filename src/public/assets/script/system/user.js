import { sender } from "/script/common/sender.js";

window.addEventListener('DOMContentLoaded', () => user.init());
const user = {
    grid: null
};

user.init = async function(){
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
            paging: {
                is: true
            }
        }
    });

    let data = await this.select({pageNo: 1, pageSize: 10});
    this.grid.setData({list: data.list});
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