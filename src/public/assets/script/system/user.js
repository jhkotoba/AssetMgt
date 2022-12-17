import { sender } from "/script/common/sender.js";

window.addEventListener('DOMContentLoaded', () => user.init());
const user = {
    data: {
        list: [],
        totalCount: 0,
        pageNo: 1,
        pageSize: 10,
        pageBlock: 10
    },
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
                is: true, size: this.data.pageSize, block: this.data.pageBlock
            }
        }
    });

    await this.select();
    this.grid.setData(this.data.list);
}

user.select = async function(){
    let response = await sender.request({
        url: '/system/getUserList',
        body: {
            paging: {no: this.data.pageNo, size: this.data.pageSize}
        }
    });
    if(response.resultCode == 'SUCCESS'){
        this.data.totalCount = response.data.totalCount;
        this.data.list = response.data.list;
    }else{
        alert(response.message);
    }
}

window._user = user;