const util = require('../../core/util.js');

module.exports = function (res_data) {
    return util.tools.clearString(JSON.stringify(res_data));
}