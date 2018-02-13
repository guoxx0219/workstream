var light=require("ueklight");
var router=light.Router();

//上传图片到服务器，返回在服务器的相对路径
router.post("/app/upload",function (req,res) {
    res.end(res.upInfo.relPath);
});