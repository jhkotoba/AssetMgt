/**
 * 외부 라이브러리 import
 */
import { sender } from "/script/common/sender.js";

/**
 * 외부 http통신 라이브러리 연결 plugin
 */
export const search = {

    createSearch: function(param){
        if(param?.is === true){

            if(param?.isLibrary === true){
                this.httpConnect(param);
            }else{
                this.settingFetch(param);
            }
        }
    },

    httpConnect: function(param){
        /**
         *  외부 라이브러리 연결 소스 작성
         */
        console.log('httpConnect::', param);
        for(let key in param.function){
            console.log('key:', key);



        }
    },

    settingFetch: function(param){

        console.log('httpConnect::', param);
        for(let key in param.function){
            console.log('key:', key);



        }
    }





}