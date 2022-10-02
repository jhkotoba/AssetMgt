const fs = require("fs");

exports.modelAndView = function(path){
    let index = fs.readFileSync(`${public}/view/index.html`).toString();
    let main = fs.readFileSync(`${public}/view/${path}`).toString();
    return index.replace("<main>", "<main>" + main);
}