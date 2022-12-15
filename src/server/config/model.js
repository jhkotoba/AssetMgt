const fs = require("fs");
const logger = require(`${basePath}/config/logger.js`);
const codeService = require(`${basePath}/services/codeService.js`);
const menuService = require(`${basePath}/services/menuService.js`);

exports.modelAndView = function(path, params){
    return Promise.all([
        // 
        new Promise((resolve, reject) => {
            fs.readFile(`${public}/view/index.html`, 'UTF-8', (error, value) => {
                if(error) reject(error);
                else resolve(value);
            })
        }),
        //
        new Promise((resolve, reject) => {
            fs.readFile(`${public}/view/${path}`, 'UTF-8', (error, value) => {
                if(error) reject(error);
                else resolve(value);
            })
        }),
        // 공통코드 필요시 세팅
        new Promise((resolve, reject) => {
            if(params?.code?.length > 0){
                codeService.getViewCodeList({groupCdList: params.code})
                    .then(data => resolve(data))
                    .catch(error => {
                        logger.error(error);
                        reject(error);
                    });
            }else{
                resolve([]);
            }
        }),
        // 메뉴 권한 체크
        new Promise((resolve, reject) => {
            if(params.request.route.path == '/'){
                resolve(true);
            }else{
                menuService.isUserMenuAuth({path, request: params.request})
                    .then(isAuth => resolve(isAuth)
                    ).catch(error => {
                        logger.error(error);
                        reject(error);
                    });
            }
            
        }),
    ])
    .then(values => {
        let html = values[0];
        if(values[3] == true){
            html = html.replace("</body>", "</body>" + `<script>window._code = JSON.parse('${JSON.stringify(values[2])}');</script>`);
            html = html.replace("<main>", "<main>" + values[1]);
        }else if(values[2].length > 0){
            html = html.replace("<body>", "<body>" + `<script>window.location.href = '/';</script>`);
        }
        return html;
    })
    .catch(error => logger.error(error));
}