/**
 * Created by Administrator on 2018/2/24 0024.
 */
var MongoClient = require("mongodb").MongoClient;
var setting = require("../setting.js");
//数据库地址
const url = setting.dburl;
//数据库名字
const dbName = setting.dbName;
function _connectDB(callback){
    MongoClient.connect(url, function(err, client) {
        if(err){
            callback(err,client);
            return
        }
        callback(err,client);
    })
}
//插入数据
exports.insertOne = function(collectionName,json,callback){
     _connectDB(function (err,client) {

         const db = client.db(dbName);
         db.collection(collectionName).insertOne(json,function(err,result){
             callback(err,result);
             client.close();
         })
     })
}
//查找数据
exports.find = function(collectionName,json,C,D){
    var result = [];
    //查找所有条件数据
    if(arguments.length == 3){
        var callback = C;
        var skipnumber = 0;
        var limit = 0;
    //分页
    }else if(arguments.length == 4){
        var callback = D;
        var args = C;
        //忽略条数
        var skipnumber = args.pageamount * args.page || 0;
        //当前页
        var limit = args.pageamount || 0;
        var sort = args.sort || {};
    }else{
        console.log("参数错误");
        client.close();
        return;
    }
    _connectDB(function (err,client) {

        const db = client.db(dbName);
        var cursor= db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort);
        cursor.each(function(err,doc){
            if(err){
                callback(err,null);
                client.close();
                return
            }
            if(doc != null){
                result.push(doc);
            }else{
                callback(null,result);
                client.close();
            }
        })


    })
}
//删除
exports.deleteMany = function (collectionName,json,callback) {
    _connectDB(function (err,client) {

        const db = client.db(dbName);
        db.collection(collectionName).deleteMany(
            json,
            function(err,results){
                callback(err,results);
                client.close();
            }
        );



    })
}

//修改
exports.updateMany = function(collectionName,json1,json2,callback){
    _connectDB(function (err,client) {

        const db = client.db(dbName);
        db.collection(collectionName).updateMany(
            json1,
            json2,
            function(err,results){
                callback(err,results);
                client.close();
            }
        );



    })
}
//获取所有数据条数
exports.getAllCount = function(collectionName,callback){
    _connectDB(function (err,client) {

        const db = client.db(dbName);
        db.collection(collectionName).count({}).then(function(count){

            callback(count);
            client.close();
        });



    })
}
