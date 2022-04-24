module.exports = function (res_data, res_err, res_errmsg) {
    if (res_err == undefined) res_err = 0;
    if (res_errmsg == undefined) res_errmsg = "";
    return {
        err: res_err,
        errmsg: res_errmsg,
        data: res_data
    };
}