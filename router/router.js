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
            //1-�������0-�ɹ���-1-�û�������
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
           //1-�������ݳ���0-�ɹ���-1-�û��Ѵ���
        });

    });
};
exports.uploadImg = function (req,res,next) {
    // �ļ���Ҫ�ϴ����ĸ��ļ�������
    var uploadfolderpath = __dirname.replace("router","public") + '/images';

    // ʹ�õ������� formidable �����ʼ��һ�� form ����
    var form = new formidable.IncomingForm();
    form.uploadDir=__dirname.replace("router","public") + '/images';
    // wangEditor_uploadImg_assist.html ҳ���url��ַ
    var assitUrl = 'http://127.0.0.1:3000/editor';

    form.parse(req, function (err, fields, files) {
        if (err) {
            return console.log('formidable, form.parse err');
        }
        console.log(files);
        var file = files['code2.jpg'];
        // formidable �Ὣ�ϴ����ļ��洢Ϊһ����ʱ�ļ������ڻ�ȡ����ļ���Ŀ¼
        var tempfilepath = file.path;
        // ��ȡ�ļ�����
        var type = file.type;

        // ��ȡ�ļ������������ļ�����ȡ��չ��
        var filename = file.name;
        var extname = filename.lastIndexOf('.') >= 0
            ? filename.slice(filename.lastIndexOf('.') - filename.length)
            : '';
        // �ļ���û����չ��ʱ������ļ�������ȡ��չ������ճ��ͼƬʱ��
        if (extname === '' && type.indexOf('/') >= 0) {
            extname = '.' + type.split('/')[1];
        }
        // ���ļ������¸�ֵΪһ��������������ļ�������
        filename = Math.random().toString().slice(2) + extname;
        console.log(filename);
        // ������Ҫ�洢���ļ���·��
        var filenewpath = uploadfolderpath + '/' + filename;

        // ����ʱ�ļ�����Ϊ��ʽ���ļ�

        fs.renameSync(tempfilepath, filenewpath, function (err) {
            // �洢���
            var result = '';
            var imgUrl = '';

            if (err) {
                // ��������
                console.log(err);
                result = assitUrl + '#�ϴ�ʧ��';
            } else {
                // ����ɹ�
                console.log('fs.rename done');
                // ƴ��ͼƬurl��ַ
                imgUrl = 'http://localhost:' + port + '/' + uploadfoldername + '/' + filename;
                result = assitUrl + '#ok|' + imgUrl;
            }


        });
    });


}