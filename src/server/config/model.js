const fs = require("fs");
const logger = require(`${basePath}/config/logger.js`);
const codeService = require(`${basePath}/services/codeService.js`);

exports.modelAndView = function(path, option){
    return Promise.all([
        new Promise((resolve, reject) => {
            fs.readFile(`${public}/view/index.html`, 'UTF-8', (error, value) => {
                if(error) reject(error);
                else resolve(value);
            })
        }),
        new Promise((resolve, reject) => {
            fs.readFile(`${public}/view/${path}`, 'UTF-8', (error, value) => {
                if(error) reject(error);
                else resolve(value);
            })
        }),
        new Promise((resolve, reject) => {
            if(option?.code?.length > 0){
                codeService.getViewCodeList({groupCdList: option.code})
                    .then(data => resolve(data))
                    .catch(error => {
                        logger.error(error);
                        reject(error);
                    });
            }else{
                resolve([]);
            }
        })
    ])
    .then(values => {
        let html = values[0];
        if(values[2].length > 0){
            html = html.replace("</body>", "</body>" + `<script>window.__code = JSON.parse('${JSON.stringify(values[2])}');</script>`);
        }
        return html.replace("<main>", "<main>" + values[1]);
    })
    .catch(error => logger.error(error));
}