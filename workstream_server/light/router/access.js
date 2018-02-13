var light=require("ueklight");
var mysql = require("./db.js");

var router=light.Router();

//判断当前管理员是否某一个权限
function access(aid,num,successFun,errFun) {
    mysql.query(`select role.lid from admin,role,level where aid=${aid} and admin.rid=role.rid and find_in_set(${num},level.lnum)`,function (err,data) {
        if(err){
            if(errFun()){
                errFun();
            }
        }else{
            if(data[0].lid.includes(num)){
                if(successFun()){
                    successFun();
                }
            }else{
                if(errFun()){
                    errFun();
                }
            }
        }
    });
}

module.exports = access;