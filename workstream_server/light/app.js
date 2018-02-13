var light=require("ueklight");
require("./router/index")
require("./router/client/index")
require("./router/upload.js")
var query=require("uekquery");
var body=require("uekpost");
var cookie=require("uekcookie");
var multer=require("uekmulter");
var xlsx = require("node-xlsx");
var app=light();
app.use(query());
app.use(body());
app.use(multer({filename:function () {
    return new Date().getTime();
}}));
app.listen(8888);


