const fs = require("fs");
const logger = require(`${basePath}/config/logger.js`);

exports.modelAndView = function(path){
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
        })
    ])
    .then(values => values[0].replace("<main>", "<main>" + values[1]))
    .catch(error => logger.error(error));
}