module.exports = function (res_data) {
    const util = require('./core/util.js');



    return util.tools.clearString(JSON.stringify(res_data));
}