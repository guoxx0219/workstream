const light=require("ueklight");
var mysql = require("../db.js");
var md5 = require("../md5.js");

const router=light.Router();

/////////////////////////////   前台   ////////////////////////
//新闻标题
router.get("/app/newsTit",function (req,res) {
    var page = req.query.page;
    var num = req.query.num;
    var obj = {};
    mysql.query(`select nid,title from news limit ${page},${num}`,function (err,data) {
        if(err){
            obj.mes = 'err';
            obj.datas = '';
            res.end(JSON.stringify(obj));
        }else{
            obj.mes = 'ok';
            obj.datas = data;
            res.end(JSON.stringify(obj));
        }
    })
});

//新闻内容
router.get("/app/newsCon",function (req,res) {
    var nid = req.query.nid;
    var obj = {};
    mysql.query("select title,con from news where nid= "+ nid,function (err,data) {
        if(err){
            obj.mes = err.toString();
            obj.datas = '';
            res.end(JSON.stringify(obj));
        }else{
            obj.mes = 'ok';
            obj.datas = data[0];
            res.end(JSON.stringify(obj));
        }
    })
});

//登录验证
router.post("/app/userLogin",function (req,res) {
    var phone = req.body.phone;
    var pass = md5(req.body.pass);
    var obj = {};
    mysql.query("select uid,upass,phone,upass from user",function (err,data) {
        if(err){
            obj.mes = 'err';
            obj.uid = "";
            res.end(JSON.stringify(obj));
        }else{
            for (var i=0;i<data.length;i++){
                if(data[i].phone == phone && data[i].upass == pass){
                    obj.mes = 'ok';
                    obj.uid = data[i].uid;
                    res.end(JSON.stringify(obj));
                }else if(i == data.length-1){
                    obj.mes = 'err';
                    obj.uid = "";
                    res.end(JSON.stringify(obj));
                }
            }
        }
    })
});

//指定部门下的用户
router.get("/app/partUser",function (req,res) {
    var pid = req.query.pid;
    mysql.query("select uid,uname from user where pid="+pid,function (err,data) {
        if(err){
            res.end("err");
        }else{
            res.end(JSON.stringify(data));
        }
    })
});

//发送日志
router.post("/app/giveLogs",function (req,res) {
    var uid1 = req.body.uid1;
    var uid2 = req.body.uid2;
    var title = req.body.title;
    var con = req.body.con;
    mysql.query(`insert into logs (uid1,uid2,title,con) values ('${uid1}','${uid2}','${title}','${con}')`,function (err,data) {
        if(err){
            res.end("err");
        }else{
            if(data.affectedRows>0){
                res.end("ok");
            }else{
                res.end("err");
            }
        }
    })
});

//查询用户发送或接收的记录--通过type区分
router.get("/app/selectGive",function (req,res) {
    var uid1 = req.query.uid1;
    var type = req.query.type;
    var sql = "";
    if(type == "send"){
        sql = `select user.uname,user.photo,logs.title,logs.ltime,logs.con from user,logs where logs.uid1=${uid1} and user.uid=logs.uid2`;
    }else{
        sql = `select user.uname,user.photo,logs.title,logs.ltime,logs.con from user,logs where logs.uid2=${uid1} and user.uid=logs.uid1`;
    }
    mysql.query(sql,function (err,data) {
        if(err){
            res.end("err");
        }else{
            res.end(JSON.stringify(data));
        }
    })
});

//查询联系人
router.get("/app/showPer",function (req,res) {
    mysql.query("select uid,uname,photo,pid,phone from user",function (err,data) {
        if(err){
            res.end("err");
        }else{
            res.end(JSON.stringify(data));
        }
    })
});

//验证旧密码
router.get("/app/regPass",function (req,res) {
    var upass = req.query.upass;
    var uid = req.query.uid;
    mysql.query("select upass from user where uid="+uid,function (err,data) {
        if(err){
            res.end("err");
        }else{
            if(data[0].upass == md5(upass)){
                res.end("ok");
            }else{
                res.end("err");
            }
        }
    })
});
//修改用户密码
router.get("/app/editPass",function (req,res) {
    var uid = req.query.uid;
    var upass = md5(req.query.upass);
    mysql.query(`update user set upass='${upass}' where uid=${uid}`,function (err,data) {
        if(err){
            res.end("err");
        }else{
            if(data.affectedRows>0){
                res.end("ok");
            }else{
                res.end("err");
            }
        }
    })
});

//查询用户名
router.get("/app/selectUname",function (req,res) {
    var uid = req.query.uid;
    mysql.query("select uname from user where uid="+uid,function (err,data) {
        if(err){
            res.end("err");
        }else{
            res.end(JSON.stringify(data[0]));
        }
    })
});
//修改用户名
router.get("/app/editUname",function (req,res) {
    var uid = req.query.uid;
    var uname = req.query.uname;
    mysql.query(`update user set uname='${uname}' where uid=${uid}`,function (err,data) {
        if(err){
            res.end("err");
        }else{
            if(data.affectedRows>0){
                res.end("ok");
            }else{
                res.end("err");
            }
        }
    })
});

//查询图片
router.get("/app/selectImg",function (req,res) {
    var uid = req.query.uid;
    mysql.query("select photo from user where uid="+uid,function (err,data) {
        if(err){
            res.end("err");
        }else{
            res.end(JSON.stringify(data[0]));
        }
    })
})

//上传图片
router.post("/app/editImg",function (req,res) {
    var uid = req.body.uid;
    var phone = req.body.phono;
    mysql.query(`update user set photo='${phone}' where uid=${uid}`,function (err,data) {
        if(err){
            res.end("err");
        }else{
            if(data.affectedRows>0){
                res.end("ok");
            }else{
                res.end("err");
            }
        }
    })
})