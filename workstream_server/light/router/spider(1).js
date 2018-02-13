//爬虫爬取过程：一次获取完所有的信息再添加到数据库
var mysql = require("./db.js");
var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var async = require("async");
var md5 = require("./md5.js");

// var CronJob = require('cron').CronJob;
// new CronJob('1 * * * * *', function() {//每分钟的第一秒发起爬虫
//     go();
// }, null, true, 'America/Los_Angeles');

/*
   "*"的意思，从左到右
秒：0-59
分钟：0-59
时间：0-23
本月的一天：1-31
月份：0-11
星期几：0-6*/

// function go() {
    var links = [];
    var datas = [];

    var buf = Buffer.alloc(65535);

    //存储buffer，将buffer分为num部分
    function save(str, num) {
        var md5str = md5(str);
        var nums = 32 / num;
        for (var i = 0; i < 32; i += nums) {
            buf[parseInt(md5str.substr(i, nums), "16")] = 1
        }
    }//布隆过滤器原理

    //对比，添加的信息和数据库的信息进行对比
    function diff(str, num, success, err) {
        var md5str = md5(str);
        var nums = 32 / num;
        var flag = true;
        for (var i = 0; i < 32; i += nums) {
            if (buf[parseInt(md5str.substr(i, nums), "16")] == 1) {
                flag = false;
            }
        }
        if (flag) {
            if(success){
                success()
            }
        } else {
            if(err){
                err()
            }
        }
    }

    async.series([
        // 1.获取数据库已有的内容
        function (next) {
            mysql.query("select * from news", function (err, data) {
                if (err) {
                    console.log(err.toString())
                } else {
                    for (var i = 0; i < data.length; i++) {
                        save(data[i].title, 8);
                    }
                    next();
                }
            })
        },
        //2、获取列表的内容
        function (next) {
            request("http://tech.ifeng.com/listpage/803/1/list.shtml", function (err,head,body) {
                var $ = cheerio.load(body);
                var arr1 = $('.zheng_list h1 a');
                var arr2 = $('.zheng_list h2 a');
                var arr3 = Array.prototype.slice.call(arr1);
                var arr4 = Array.prototype.slice.call(arr2);
                var arr = arr3.concat(arr4);
                arr.forEach(function (item, index) {
                    links.push($(item).attr('href'));
                });
                next();
            })
        },
        //3、获取内容页
        function (next) {
            //每一次爬取的过程
            async.eachSeries(links, function (url, next1) {
                request(url, function (err, head, body) {
                    var $ = cheerio.load(body);
                    var arr = [];
                    //查询新闻标题
                    var title = $('#artical_topic').text();
                    //标题已经存在的执行查询内容，不存在的放入数据库datas
                    diff(title, 8, function () {
                        //查询新闻内容
                        var con = $('#artical_real').text();
                        arr.push(title);
                        arr.push(con);
                        datas.push(arr);
                        console.log(title)
                    },function () {
                        console.log(title+"——已经存在")
                    });
                    next1();
                })
            }, function () {
                next();
            })
        },
        //4、放到数据库
        function (next) {
            mysql.query("insert into news (title,con) values ?", [datas], function (err, data1) {
                if (err) {
                    next(err.toString());
                } else {
                    next(null, data1.affectedRows);
                }
            })
        }
    ], function (err, num) {
        if (err) {
            console.log(err.toString())
        } else {
            console.log(num);
        }
    });
// }

//爬取图片
/*request("http://www.tynews.com.cn/jrjj/", function (err, response, body) {
    if (err) {
        console.log(err)
    } else {
        var $ = cheerio.load(body);
        $("img").each(function (index, item) {
            var path = $(item).attr("src");
            var exname = path.substr(path.lastIndexOf("."));
            request(path).pipe(fs.createWriteStream("./imgs/"+index+exname))
        })

    }
});*/

