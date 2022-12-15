// /**
//  * 외부 라이브러리 import
//  */
// import { sender } from "/script/common/sender.js";

// /**
//  * 외부 http통신 라이브러리 연결 plugin
//  */
// export const search = {

//     createSearch: function(param){
//         console.log('createSearch 1');
//         if(param?.is !== true){
//             return;
//         }
//         console.log('createSearch 2');
//         let fn = null;
//         if(param?.isLibrary === true){
//             fn = this.httpConnect(param);
//         }else{
//             fn = this.settingFetch(param);
//         }
//         console.log('createSearch 3:',fn);
//         return fn;
//     },

//     httpConnect: function(param){
//         /**
//          *  외부 라이브러리 연결 소스 작성
//          */
//         console.log('httpConnect::', param);
//         for(let key in param.function){
//             console.log('key:', key);



//         }
//     },

//     settingFetch: function(search){
//         console.log('search:', search);
//         let data = search.data;

//         let fn = {
//             call: {},
//             callback: {}
//         };
//         let item = null;
//         for(let key in search.function){

//             item = search.function[key];

//             switch(item.type){
//             case 'select':
//                 fn.call[key] = function(){
//                     return fetch(item.url, {method: search?.method ? search.method : 'POST', body: JSON.stringify(search.data)})
//                         .then(r => r.json())
                        
//                 } 
//             case 'update':
//                 break;
//             case 'insert':
//                 break;
//             case 'delete':
//                 break;
//             }
//         }
//         return fn;
//     }
// }