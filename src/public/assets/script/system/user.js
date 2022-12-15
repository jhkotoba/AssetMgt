import { sender } from "/script/common/sender.js";
import { common } from "/script/common/common.js";

window.addEventListener('DOMContentLoaded', () => user.init());
const user = {
    data: {
        paging: {
            no: 1,
            size: 10,
            block: 10,
            element: document.getElementById('paging')
        }
    },
    grid: null
};

user.init = async function(){
    user.grid = new wGrid('userList', {
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

    user.grid.setData(await user.select());
}

user.select = async function(){
    let response = await sender.request({
        url: '/system/getUserList',
        body: {
            paging: user.data.paging
        }
    });
    if(response.resultCode == 'SUCCESS'){
        return response.data
    }else{
        alert(response.message);
    }
}

// user.paging = function(){
//     common.childElementEmpty(this.data.paging.element);



// }

window._user = user;