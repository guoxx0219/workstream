const light=require("ueklight");
var mysql = require("./db.js");
var md5 = require("./md5");
var access = require("./access");
var fs = require("fs");
var path = require("path");
var xlsx = require("node-xlsx");
var series = require('async/series');

const router=light.Router();

//走后台
router.get("/admin",function (req,res) {
    res.sendFile("./views/admin.html");
});
//走前台
router.get("/",function (req,res) {
    res.sendFile("./views/index.html");
})

/////////////////////////////  后台  /////////////////////////////

//登录
router.post("/app/login",function(req,res){
    var name = req.body.name.replace(/[']/,"\'");
    var pass = md5(req.body.pass);
    var obj = {mes:'',result:''};
    // mysql.query("select * from admin",function (err,data) {
    //     if (err){
    //         res.end('err');
    //     }else{
    //         if(data[0].aname == name && data[0].apass == md5(pass)){
    //             res.end('ok');
    //         }else{
    //             res.end('err')
    //         }
    //     }
    // })

    mysql.query(`select * from admin where aname='${name}' and apass='${pass}'`,function (err,data) {
        if (err){
            obj.mes = 'err';
            obj.result = "";
            res.end(JSON.stringify(obj));
        }else{
            if (data.length){
                obj.mes = 'ok';
                obj.result = data;
                res.end(JSON.stringify(obj));
            }else{
                obj.mes = 'err';
                obj.result = "";
                res.end(JSON.stringify(obj));
            }
        }
    })
});

//权限
router.get("/app/insertLevel",function (req,res) {
    var lname = req.query.lname;
    var lnum = req.query.lnum;
    mysql.query(`insert into level (lname,lnum) values ('${lname}','${lnum}')`,function (err,data) {
        if(err){
            res.end('err');
        }else {
            if(data.affectedRows>0){
                res.end('ok');
            }else{
                res.end('err');
            }
        }
    })
});
router.get("/app/selectLevel",function (req,res) {
    mysql.query("select * from level",function (err,data) {
        if(err){
            res.end((err).toString());
        }else{
            res.end(JSON.stringify(data));
        }
    })
});
router.get("/app/editLevel",function (req,res) {
    var lid = req.query.lid;
    var lname = req.query.lname;
    var lnum = req.query.lnum;
    mysql.query(`update level set lname='${lname}',lnum=${lnum} where lid=${lid}`,function (err,data) {
        if(err){
            res.end((err).toString());
        }else{
            if (data.affectedRows>0){
                res.end('ok');
            }else{
                res.end('err');
            }
        }
    })
});
router.get("/app/delLevel",function (req,res) {
    var id = req.query.id;
    var aid = req.query.aid;
    var lnum = req.query.lnum;
    access(aid,4,function () {
        mysql.query("select lid,rid from role",function (err,data) {
            if(err){
                res.end('err');
            }else{
                var newlid = '';
                var rid;
                var flag = false;
                //查询所有角色中是否存在相应的权限
               for(var i=0;i<data.length;i++){
                   if(data[i].lid.includes(lnum)) {
                       //有这种权限的角色有多个
                       if (data[i].lid.includes(',')) {
                           newlid = data[i].lid.split(',');
                           newlid.forEach((ele,index) => {
                               if (ele == lnum) {
                                   newlid.splice(index, 1);
                               }
                           })
                           newlid.join(',');
                           rid = data[i].rid;
                           //将角色表中关于此权限的信息进行更新
                           mysql.query(`update role set lid='${newlid}' where rid=${rid}`,function (err2,result) {
                            if(err2){
                                res.end('err2');
                            }else{
                                  if (result.affectedRows>0){
                                      // 删除权限
                                      mysql.query("delete from level where lid="+id,function (err3,data2) {
                                          if (err3){
                                              res.end('err3');
                                          }else{
                                              if (data2.affectedRows>0){
                                                  res.end('ok');
                                              }else{
                                                  res.end('err');
                                              }
                                          }
                                      })
                                  }else{
                                      res.end('修改此权限的角色失败')
                                  }
                              }
                           })
                       } else {
                           //有这种权限的角色只有一个，先删角色
                           res.end("请先删除对应的角色")
                       }
                   }
                   if(i == data.length-1){
                       flag = true;
                   }
               }
               //flag确保对所有角色的权限进行查询，没有对应的角色，直接删除权限
               if(flag){
                   mysql.query("delete from level where lid="+id,function (err4,data3) {
                       if (err4){
                           res.end('err4');
                       }else{
                           if (data3.affectedRows>0){
                               res.end('ok');
                           }else{
                               res.end('err');
                           }
                       }
                   })
               }
            }
        })
    },function () {
        res.end('没有权利删除！')
    })
})

//管理员
router.get("/app/selectAdmin",function (req,res) {
    var aid = req.query.aid;
    if(aid == 1){
        mysql.query("select admin.aid,admin.aname,admin.photo,role.mname from admin,role where admin.rid=role.rid",function (err,data) {
            if(err){
                res.end('err');
            }else{
                res.end(JSON.stringify(data));
            }
        })
    }else{
        mysql.query("select admin.aid,admin.aname,admin.photo,role.mname from admin,role where admin.rid=role.rid and aid="+aid,function (err,data) {
            if(err){
                res.end('err');
            }else{
                res.end(JSON.stringify(data));
            }
        })
    }

});
router.post("/app/addManager",function (req,res) {
    var aname = req.body.aname;
    var rid = req.body.rid;
    var apass = md5('123456');
    var phpto = req.body.img;
    mysql.query(`insert into admin (aname,apass,rid,photo) values ('${aname}','${apass}','${rid}','${phpto}')`,function (err,data) {
        if(err){
            res.end('err');
        }else {
            if(data.affectedRows>0){
                res.end('ok');
            }else{
                res.end('err');
            }
        }
    })
});
router.post("/app/editManager",function (req,res) {
    var aname = req.body.aname;
    var rid = req.body.rid;
    var photo = req.body.img;
    var aid = req.body.aid;
    mysql.query(`update admin set aname='${aname}',rid='${rid}',photo='${photo}' where aid=`+aid,function (err,data) {
        if(err){
            res.end('err');
        }else {
            if(data.affectedRows>0){
                res.end('ok');
            }else{
                res.end('err');
            }
        }
    })
});
router.get("/app/delManager",function (req,res) {
    var aid = req.query.id;
    mysql.query(`delete from admin where aid=`+aid,function (err,data) {
        if(err){
            res.end('err');
        }else {
            if(data.affectedRows>0){
                res.end('ok');
            }else{
                res.end('err');
            }
        }
    })
});
router.post("/app/editPass",function (req,res) {
    var aid = req.body.aid;
    var apass = md5(req.body.apass);
    var newpass = md5(req.body.newpass);
    mysql.query(`select apass from admin where aid=${aid}`,function (err,data) {
        if(data[0].apass == apass){
            mysql.query(`update admin set apass='${newpass}' where aid=${aid}`,function (err,data) {
               if(err){
                   res.end('err');
               }else{
                   if (data.affectedRows>0){
                       res.end('ok');
                   }else{
                       res.end('err');
                   }
               }
            })
        }else{
            res.end('旧密码输入错误');
        }
    })
})

//角色
router.get("/app/addRole",function (req,res) {
    var mname = req.query.mname;
    var lid = req.query.lid;
    mysql.query(`insert into role (mname,lid) values ('${mname}','${lid}')`,function (err,data) {
        if(err){
            res.end('err');
        }else {
            if(data.affectedRows>0){
                res.end('ok');
            }else{
                res.end('err');
            }
        }
    })
});
router.get("/app/selectRole",function (req,res) {
    mysql.query("select * from role",function (err,data) {
        if(err){
            res.end((err).toString());
        }else{
            mysql.query("select * from level",function (err,result) {
                var levels = JSON.stringify(result);
                for (var i=0;i<data.length;i++){
                    var lids = data[i].lid.split(',');
                    for (var j=0;j<lids.length;j++){
                        for (var k=0;k<result.length;k++){
                            if (lids[j] == result[k].lnum){
                                lids[j] = result[k].lname;
                            }
                        }
                    }
                    data[i].lid = lids.join('、');
                }
                data.push({'levels':levels});
                res.end(JSON.stringify(data));
            })
        }
    })
});
router.get("/app/editRole",function (req,res) {
    var mname = req.query.mname;
    var lid = req.query.lid;
    var rid = req.query.rid;
    mysql.query(`update role set mname='${mname}',lid='${lid}' where rid=`+rid,function (err,data) {
        if(err){
            res.end('err');
        }else {
            if(data.affectedRows>0){
                res.end('ok');
            }else{
                res.end('err');
            }
        }
    })
});
router.get("/app/delRole",function (req,res) {
    var rid = req.query.rid;
    var aid = req.query.aid;

    //1.判断当前管理员是否存在删除的权限access.js
    //是：继续下一步
    //不是：终止并返回err
    //2.删除的当前的角色是否存在对应的管理员
    // 是：1.删除在服务器的该管理员头像fs.unlinkSync(path)
    ////   2.删除管理员信息
    ////   3.删除当前角色
    //不是：
    // 直接删除该角色

    access(aid,4,function () {
        // 有删除的权限
        // 1.是否存在对应的管理员
        mysql.query("select photo from admin where admin.rid="+rid,function (err,data) {
            if(err){
                res.end('err');
            }else{
                if(data.length){
                    //删除角色对应的管理员
                    mysql.query("delete from admin where rid="+rid,function (err1,data1) {
                        if(err1){
                            res.end('err1');
                        }else{
                            if (data1.affectedRows>0){
                                //删除角色
                                mysql.query("delete from role where rid="+rid,function (err2,data2){
                                     if (err2){
                                         res.end('err2');
                                     }else{
                                         //删除该管理员在服务器的头像，
                                         for (var i=0;i<data.length;i++){
                                             if(data[i].photo){
                                                 fs.unlinkSync(data[i].photo);
                                             }
                                         }
                                         res.end('ok');
                                     }
                                })
                            }else{
                                res.end('删除用户失败');
                            }
                        }
                    })
                }else{
                    //没有管理员，直接删除角色
                    mysql.query("delete from role where rid="+rid,function (err3,data2){
                        if (err3){
                            res.end('err3');
                        }else{
                            res.end('ok');
                        }
                    })
                }
            }
        })
    },function () {
       // 没有删除的权限
       res.end('没有权限删除');
    });
});
//仅查询id和角色名  --部分查询
router.get("/app/findRole",function (req,res) {
    mysql.query("select rid,mname from role",function (err,data) {
        if (err){
            res.end('err');
        }else{
            res.end(JSON.stringify(data))
        }
    })
})

//部门
router.get("/app/addPart",function (req,res) {
    var pname = req.query.pname;
    var parentId = req.query.parentId;
    mysql.query(`insert into part (pname,parentId) values ('${pname}','${parentId}')`,function (err,data) {
        var obj = {};
        if(err){
            obj.mes = 'err';
            obj.id = '';
            res.end(JSON.parse(obj));
        }else {
            if(data.affectedRows>0){
                var id = data.insertId;
                obj.mes = 'ok';
                obj.id = id;
                res.end(JSON.stringify(obj));
            }else{
                obj.mes = 'err';
                obj.id = '';
                res.end(JSON.stringify(obj));
            }
        }
    })
});
router.get("/app/selectPart",function (req,res) {
    mysql.query("select * from part",function (err,data) {
        if(err){
            res.end('err');
        }else{
            res.end(JSON.stringify(data));
        }
    })
});
router.get("/app/selectParent",function (req,res) {
    var pid = req.query.pid;
    mysql.query("select * from part where pid="+pid,function (err,data) {
        if(err){
            res.end('err');
        }else{
            if(data.length){
                res.end(data[0].pname);
            }else{
                res.end('一级部门');
            }
        }
    })
});
router.get("/app/delPart",function (req,res) {
    var pid = req.query.id;
    var aid = req.query.aid;
    //判断当前管理员是否具有删除部门的权限
    access(aid,4,function () {
        //管理员具有删除的权限
        //1.删除该部门对应的用户
        //2.查找并删除该部门的子部门
        //3.删除该部门

        //2.查找该部门对应的子部门
        mysql.query("select pid from part where parentid="+pid,function (err,data) {
            if (err){
                res.end('err');
            }else{
                if(data.length){
                    //存在子部门
                    var str = '';
                    for (var i=0;i<data.length;i++){
                        str += data[i].pid+',';
                    }
                    str = str.slice(0,-1);
                    //删除所有该部门的子部门
                    mysql.query(`delete from part where pid in (${str})`,function (err,data) {
                        if(err){
                            res.end('err');
                        }else{
                            if(data.affectedRows>0){
                                //删除该部门
                                mysql.query("delete from part where pid="+pid,function (err,data) {
                                    if(err){
                                        res.end('err');
                                    }else{
                                        if(data.affectedRows>0){
                                            res.end('ok');
                                        }else{
                                            res.end('删除该部门出错');
                                        }
                                    }
                                })
                            }else{
                                res.end('删除子部门出错');
                            }
                        }
                    })
                }else{
                //   不存在子部门，直接删除该部门
                 mysql.query("delete from part where pid="+pid,function (err,data) {
                        if(err){
                            res.end('err');
                        }else{
                            if(data.affectedRows>0){
                                res.end('ok');
                            }else{
                                res.end('删除该部门出错');
                            }
                        }
                    })
                }
            }
        });
    },function () {
        res.end('没有权利删除')
    })
});
router.get("/app/editPart",function (req,res) {
    var pid = req.query.pid;
    var pname = req.query.pname;
    var parentid = req.query.parentid;
    mysql.query(`update part set pname='${pname}',parentid='${parentid}' where pid=`+pid,function (err,data) {
        var obj = {};
        if(err){
           res.end('err');
        }else {
            if(data.affectedRows>0){
                res.end('ok');
            }else{
                res.end('err');
            }
        }
    })
});

//用户管理
router.get("/app/userPart",function (req,res) {
    var parentid = req.query.parentid;
    mysql.query("select pid,pname from part where parentid="+parentid,function (err,data) {
     if(err){
         res.end('err');
     }else{
         data.forEach((ele,index)=> {
             mysql.query("select * from part where parentid=" + ele.pid, function (err1, result) {
                 if (err1) {
                     res.end('err');
                 } else {
                     if (result.length) {
                         ele.son = true;
                     } else {
                         ele.son = false;
                         ele.style = {color:''};
                     }
                     if(index == data.length-1){
                         res.end(JSON.stringify(data));
                     }
                 }
             })
         })
     }
    })
});
router.get("/app/addUser",function (req,res) {
    var uname = req.query.uname;
    var pid = req.query.pid;
    var phone = req.query.phone;
    var photo = "static/img/photo.jpg";
    var upass = md5('123456');
    mysql.query(`replace into user (uname,pid,phone,upass,photo) values ('${uname}',${pid},'${phone}','${upass}','${photo}')`,function (err,data) {
        if(err){
            res.end('err');
        }else{
            if (data.affectedRows>0){
                res.end('ok');
            }else{
                res.end('err');
            }
        }
    })
});
router.get("/app/showUser",function (req,res) {
    var pid = req.query.pid;
    mysql.query(`select user.*,part.pname from user,part where user.pid=${pid} and part.pid=${pid}`,function (err,data) {
        if(err){
            res.end('err');
        }else{
            res.end(JSON.stringify(data))
        }
    })
});

//Excel上传用户信息
//1.判断表中的部门是最小单位且用户信息能与数据库信息对应
//   1.找部门所有的信息  --服务器消耗大，考虑数据缓存，采用分布式存储的技术Hadoop（大数据）
//   2.找部门最小单位
//   3.数据库信息和上传的数据对比  --串行执行async.series(解决回调地狱)
router.post("/app/uploadUser",function (req,res) {
    var obj = xlsx.parse(res.upInfo.path)[0].data;

    //excel表中部门的信息并去重
    var datas = [];
    for (var i=1;i<obj.length;i++){
        datas.push(obj[i][2]);
    }
    //去重
    var obj = new Set(datas);
    datas = Array.from(obj);

    var data = [];
    //series进行串行执行
    series([function (callback) {
        //所有部门信息
        mysql.query("select * from part",function (err,result) {
            if(err){
                res.end('err');
            }else {
                data = result;

                callback(null);
            }
        })
    },function (callback) {
        //过滤最小部门
        var table = [];
        for(var i=0;i<data.length;i++){
            //flag:false表示没有子部门
            var flag = false;
            for (var j=0;j<data.length;j++){
                if(data[i].pid == data[j].parentid){
                    flag = true;
                    break;
                }
            }
            if(!flag){
                table.push(data[i]);
            }
        }
        callback(null,table);
    }],function (err,data) {
        var table = data[1];

        //映射 数据字典
        //{ '督导部': 3,
        //'校企部': 5,'统招部': 7,'全栈': 9,'学生部': 10,UI: 85,'删1': 40 }
        var some = {};
        table.forEach(ele=>{
            some[ele.pname] = ele.pid;
        })

        // 检查表格信息是否符合数据库要求
        for (var i=0;i<datas.length;i++){
            //false表示表格中的信息和数据库信息不符合
            var flag = false;
            //存储与数据库信息不符的表给信息
            var current = [];
            for (var j=0;j<table.length;j++){
                if(datas[i] == table[j].pname){
                    flag = true;
                    break;
                }
            }
            if(!flag){
                current.push(datas[i]);
            }
        }
        if(current.length>0){
            res.end(JSON.stringify(current));
        }else{
            //存储到数据库
            //1.将部门映射为pid
            //2.?占位符进行添加数据库
            var arr = [];
            xlsx.parse(res.upInfo.path)[0].data.slice(1).forEach(ele=>{
                var object = [];
                object.push(ele[0],ele[1],some[ele[2]],md5('123456'),'');
                arr.push(object);
            })
            mysql.query("replace into user (uname,phone,pid,upass,photo) values ?",[arr],function (err,result) {
                if(err){
                    res.end(err.toString());
                }else{
                    if(result.affectedRows>0){
                        res.end('ok');
                    }else{
                        res.end('删除出错');
                    }
                }
            })
        }
    });
})
