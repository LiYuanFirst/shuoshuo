/**
 * Created by Administrator on 2018/3/6 0006.
 */

var crypto = require("crypto");
module.exports = function md5(str){
    var md5 = crypto.createHash("md5");
    var password = md5.update(str).digest("base64");
    return password;
}