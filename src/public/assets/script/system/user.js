window.addEventListener('DOMContentLoaded', () => user.init());
const user = {
    data: {},
    grid: null
};

user.init = async function(){
    user.grid = new wGrid('userList', {
        fields: [
            {title:'사용자번호', element: 'text', name: 'userNo', width: '5%'},
            {title:'사용자 아이디', element: 'text', name: 'userId', width: '18%'},
            {title:'이메일', element: 'text', name: 'email', width: '18%'},
            {title:'권한', element: 'text', name: 'authCd', width: '18%'},
            {title:'수정일시', element: 'datetime', name: 'uptDttm', width: '10%'},
            {title:'등록일시', element: 'datetime', name: 'insDttm', width: '10%'},
        ],
        option: {},
        search: {
            is: true,
            isLibrary: true,
            function : {
                select: {url: '/system/getUserList', type: 'select'}
            },
            paging: {
                is: true,
            }
        }
    });

    // user.grid.setData(await user.select());
}

// user.select = async function(params){
//     return await sender.request({
//             url: '/system/getUserList', 
//             body: {
//                 paging: {
//                     no: user.data.paging.no,
//                     size: user.data.paging.size,
//                 }
//             }
//         }
//     );
// }

