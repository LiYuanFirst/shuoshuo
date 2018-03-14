/**
 * Created by Administrator on 2018/3/7 0007.
 */
var formidable = require("formidable");
var md5 = require("../models/md5.js");
var db = require("../models/db.js");
var path = require('path');
var fs = require('fs');
var util = require('util');
exports.showIndex = function(req,res,next){
    if(req.session.login){
        res.render("index",{"login":true,"username":req.session.username});
    }else{
        res.render("index",{"login":false});
    }


}
exports.showLogin = function(req,res,next){
    res.render("login");
}
exports.showRegister = function(req,res,next){
    res.render("register");
}
exports.showCenter = function(req,res,next){
    res.render("userCenter");
}
exports.showEditor = function(req,res,next){
    if(req.session.login){
        res.render("editor",{"login":true,"username":req.session.username});
    }else{
        res.render("editor",{"login":false});
    }
}



exports.doLogin = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        var username = fields.username,
            password = fields.password;
        password = md5(md5(password).substr(4,7) + md5(password));
        db.find("users",{"username":username},function(err,result){
            if(result.length==0){
                res.json({"result":-1});
            }else{
                if(result[0].password === password){
                    req.session.login = true;
                    req.session.username = username;
                    res.json({"result":0});
                    return;
                }
                res.json({"result":1});
            }
            //1-密码错误，0-成功，-1-用户不存在
        });
    })
}
exports.doRegister = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        console.log(fields.username);
        var username = fields.username,
            password = fields.password;
        password = md5(md5(password).substr(4,7) + md5(password));
        db.find("users",{"username":username},function(err,result){
            if(result.length==0){
                db.insertOne("users",{
                    "username":username,
                    "password":password,
                    "time":new Date()
                }, function (err,result) {
                    if(err){
                        res.json({"result":1});
                        return;
                    }
                    req.session.login = true;
                    req.session.username = username;
                    res.json({"result":0});


                })
            }else{
                res.json({"result":-1});
            }
           //1-插入数据出错，0-成功，-1-用户已存在
        });

    });
};
exports.uploadImg = function (req,res,next) {
    // 文件将要上传到哪个文件夹下面
    var uploadfolderpath = __dirname.replace("router","public") + '/images';

    // 使用第三方的 formidable 插件初始化一个 form 对象
    var form = new formidable.IncomingForm();
    form.uploadDir=__dirname.replace("router","public") + '/images';
    // wangEditor_uploadImg_assist.html 页面的url地址
    var assitUrl = 'http://127.0.0.1:3000/editor';

    form.parse(req, function (err, fields, files) {
        if (err) {
            return console.log('formidable, form.parse err');
        }
        console.log(files);
        var file = files['code2.jpg'];
        // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
        var tempfilepath = file.path;
        // 获取文件类型
        var type = file.type;

        // 获取文件名，并根据文件名获取扩展名
        var filename = file.name;
        var extname = filename.lastIndexOf('.') >= 0
            ? filename.slice(filename.lastIndexOf('.') - filename.length)
            : '';
        // 文件名没有扩展名时候，则从文件类型中取扩展名（如粘贴图片时）
        if (extname === '' && type.indexOf('/') >= 0) {
            extname = '.' + type.split('/')[1];
        }
        // 将文件名重新赋值为一个随机数（避免文件重名）
        filename = Math.random().toString().slice(2) + extname;
        console.log(filename);
        // 构建将要存储的文件的路径
        var filenewpath = uploadfolderpath + '/' + filename;

        // 将临时文件保存为正式的文件

        fs.renameSync(tempfilepath, filenewpath, function (err) {
            // 存储结果
            var result = '';
            var imgUrl = '';

            if (err) {
                // 发生错误
                console.log(err);
                result = assitUrl + '#上传失败';
            } else {
                // 保存成功
                console.log('fs.rename done');
                // 拼接图片url地址
                imgUrl = 'http://localhost:' + port + '/' + uploadfoldername + '/' + filename;
                result = assitUrl + '#ok|' + imgUrl;
            }


        });
    });


}