<template>
    <div>
        <Header captical="设置" :showLeft="true" :showRight="false"></Header>
        <form enctype="multipart/form-data" method="post">
            <div class="setCon">
                <div class="setTop">
                    <div class="images">
                        <img :src="'http://localhost:8888/'+imgFile" alt="" @click="editImg">
                    </div>
                </div>
                <ul class="mui-table-view">
                    <li class="mui-table-view-cell">
                        <router-link to="/editPass" class="mui-navigate-right">修改密码</router-link>
                    </li>
                    <li class="mui-table-view-cell">
                        <router-link to="/editUname" class="mui-navigate-right">修改用户名</router-link>
                    </li>
                    <li class="mui-table-view-cell signout" @click="signOut">退出账号</li>
                </ul>
                <!--触发选择图片-->
                <input type="file" accept="image/*" v-show="false" class="file">
                <!--存放图片在服务器的地址-->
                <input type="hidden" v-model="imgFile">
                <video id="video"></video>
            </div>
        </form>
        <div id="forward" class="mui-popover mui-popover-action mui-popover-bottom">
            <ul class="mui-table-view">
                <!--<li class="mui-table-view-cell" @click="picture">拍照-->
                <!--</li>-->
                <li class="mui-table-view-cell" @click="selectFile">从相册中选择
                </li>
            </ul>
            <ul class="mui-table-view">
                <li class="mui-table-view-cell">
                    <b @click="delF">取消</b>
                </li>
            </ul>
        </div>
        <Nav v-show="showNav"></Nav>
        <div class="mask" v-show="mask">
        </div>
        <div class="mes" v-show="mes">
            {{mes}}
        </div>
    </div>
</template>
<script>
    import Header from '@/components/header.vue'
    import Nav from '@/components/nav.vue'

    export default {
        name:'setting',
        components:{Header,Nav},
        data(){
            return{
                showNav:true,
                mask:false,
                //提交数据库的图片 upload/xxx.jpg
                imgFile:"",
                mes:""
            }
        },
        methods:{
            //拍照
            picture(){
                //1. video作为视频流
                var video = document.querySelector('#video');
                var videoObj = {"video": true};
                // opera应使用opera.getUserMedianow
                if(navigator.getUserMedia){
                    navigator.getUserMedia(videoObj,success,error);
                }
                function success(stream) {
                    //video标签中显示动态的视频流
                    video.src = stream;
                    video.play();
                }
                function error() {
                    console.log('error');
                }
                //2. canvas实时捕获video内容进行拍照
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = "#ffffff";
                ctx.drawImage(video,0,0,330,250);
                document.body.append(canvas);
                //3. 从canvas中获取图片数据
                //将canvas转为base64位的PNG图片
                var imgData = canvas.toDataURL("image/png");
                //截取22位之后的字符串作为图像数据
                var data = imgData.substr(22);
                this.update(data);
            },
            //退出
            signOut(){
                this.$router.push("/login");
                this.$store.commit("setUid","");
                localStorage.removeItem("login");
            },
            editImg(e) {
                this.mask = true;

                var forward = document.querySelector("#forward");
                forward.style.opacity = 1;
                forward.style.display = "block";
                forward.style.bottom = "154px";
                this.showNav = false;
            },
            //相册选择
            selectFile(){
                var that = this;
                var file = document.querySelector(".file");
                file.click();
                //图片大小最大为200k
                var maxSize = 200 * 1024;
                this.mask = false;
                var forward = document.querySelector("#forward");
                forward.style.opacity = 0;
                this.showNav = true;
                file.onchange = function () {
                    //图片信息:大小，name
                    var data = this.files[0];
                    //h5新对象
                    var reader = new FileReader();
                    //读取图片路径
                    reader.readAsDataURL(data);
                    //读取成功时
                    reader.onload = function (e) {
                        //读取为base64格式，可直接在页面中显示
                        var result = e.target.result;
                        //图片以表单形式提交,提交data
                        let formData = new FormData();
                        formData.append("file", data);
                        if(result.length < maxSize){
                            //上传头像到服务器
                            that.update(formData);
                        }else{
                            that.mask = true;
                            that.mes = "图片大小不超过200k";
                            setTimeout(()=>{
                                that.mask = false;
                                that.mes = "";
                            },2000);
                        }
                    }
                }
            },
            update(data){
                fetch("/app/upload",{
                    method: 'post',
                    headers:{ 'Content-Type':
                        'multipart/form-data'},
                    body: data
                }).then(e=>{
                    return e.text();
                }).then(res=>{
                    this.imgFile = res;
                    //上传头像到数据库
                    fetch("/app/editImg",{
                        method: 'post',
                        headers:{ 'Content-Type':
                            'application/x-www-form-urlencoded'},
                        body: `uid=${this.$store.state.uid}&phono=${this.imgFile}`
                    }).then(e=>{
                        return e.text();
                    }).then(res=>{
                        this.mask = true;
                        if(res == "ok"){
                            this.mes = "更改头像成功";
                        }else{
                            this.mes = "更改头像失败"
                        }
                        setTimeout(()=>{
                            this.mask = false;
                            this.mes = "";
                        },2000);
                    })
                });
            },
            delF(){
                this.mask = false;
                var forward = document.querySelector("#forward");
                forward.style.opacity = 0;
                forward.style.display = "none";
                forward.style.bottom = "0";
                this.showNav = true;
            }
        },
        mounted(){
            var uid = this.$store.state.uid;
            fetch("/app/selectImg?uid="+uid).then(e=>{
                return e.json();
            }).then(res=>{
                this.imgFile = res.photo;
            })
        }
    }
</script>
<style>
    .setCon{
        padding-top: 44px;
    }
    .images{
        width: 100px;
        height: 100px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }
    .images>img{
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 50%;
    }
    .setTop{
        width: 100%;
        height: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .mui-navigate-right{
        text-align: left;
    }
    .signout{
        text-align: center;
        color: #007aff;
    }
    .mask{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.3);
        z-index: 99;
    }
    .mui-popover.mui-popover-action{
        width: 96%!important;
    }
    .mes{
        width:70%;
        height: 12%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right:0;
        margin:auto;
        background: #ffffff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        z-index:9999;
        line-height: 80px;
    }
</style>