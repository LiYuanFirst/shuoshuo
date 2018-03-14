/**
 * Created by Administrator on 2018/3/7 0007.
 */
var express = require("express");
var app = express();
var router = require("./router/router.js");

var cookieParser = require("cookie-parser");
var session = require("express-session");
app.use(session({
    secret:"keyboard cat",
    resave: false,
    saveUninitialized: true
}));

app.set("view engine","ejs");

app.use(express.static("./public"));

app.get("/",router.showIndex);
app.get("/login",router.showLogin);
app.get("/register",router.showRegister);
app.get("/userCenter",router.showCenter);
app.get("/editor",router.showEditor);


app.post("/doLogin",router.doLogin);
app.post("/doRegister",router.doRegister);
app.post("/uploadImg",router.uploadImg);
app.listen(3000);