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
            //1-密码错误0-成功-1-账号不存在
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
           //1-插入出错0-成功-1-账号已存在
        });

    });
};
//图片上传
exports.uploadImg = function (req,res,next) {
    //设置图片上传地址
    var uploadfolderpath = __dirname.replace("router","public") + '/uploads';

    var form = new formidable.IncomingForm();
    //图片上传临时缓存地址
    form.uploadDir=__dirname.replace("router","public") + '/uploads';
    //返回图片地址路径
    var assitUrl = 'http://127.0.0.1:3000/uploads';

    form.parse(req, function (err, fields, files) {
        if (err) {
            return console.log('formidable, form.parse err');
        }
        //图片上传name 必须与前台保持一致
        var file = files['images'];
        var tempfilepath = file.path;
        var type = file.type;

        var filename = file.name;
        //获取图片后缀名
        var extname = filename.lastIndexOf('.') >= 0
            ? filename.slice(filename.lastIndexOf('.') - filename.length)
            : '';
        if (extname === '' && type.indexOf('/') >= 0) {
            extname = '.' + type.split('/')[1];
        }
        //重新定义上传后图片名称
        filename = Math.random().toString().slice(2) + extname;
        console.log(filename);

        //定义图片全路径
        var filenewpath = uploadfolderpath + '/' + filename;

        //将缓存文件重命名为指定文件
        fs.rename(tempfilepath, filenewpath, function (err) {


            if (err) {
                console.log(err);
                res.json({"errno":1});
            }else {
                //重命名成功后删除原缓存文件
                fs.unlink(tempfilepath, function(err){
                    var result = assitUrl + "/" + filename;
                    res.json({"errno":0, data: [result]});
                });

            }


        });
    });


}