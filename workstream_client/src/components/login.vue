<template>
    <div class="box">
        <div class="login">
            <h3>登录界面</h3>
            <div class="mui-input-group">
                <div class="mui-input-row">
                    <label>用户名：</label>
                    <input type="text" class="mui-input-clear" placeholder="请输入手机号码" @blur="check('user')" ref="user" v-model="userVal">
                </div>
                <p v-show="userReg">*{{user}}</p>
                <div class="mui-input-row">
                    <label>密码：</label>
                    <input type="password" class="mui-input-clear mui-input-password" placeholder="请输入密码" @blur="check('pass')" ref="pass" v-model="passVal">
                </div>
            </div>
            <p v-show="passReg">*{{pass}}</p>
            <div class="twoBtn">
                <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined" @click="login">登录</button>
                <button type="button" class="mui-btn mui-btn-warning mui-btn-outlined" @click="delLog">取消</button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name:'login',
        data() {
            return {
                //是否显示p标签
                userReg:false,
                passReg:false,
                //p标签中的内容
                user:'',
                pass:'',
                //是否验证完毕，进行登录
                flag:false,
                //确保验证了用户名
                flag1:false,
                //确保验证了密码
                flag2:false,
                userVal:'',
                passVal:''
            };
        },
        methods: {
            check(type){
                //flag1、flag2确保进行了验证
                if(type === "user"){
                    //验证用户名
                    var value = this.$refs.user.value;
                    if(!value.trim() || !value){
                        this.userReg = true;
                        this.user = "用户名不能为空"
                    }else if(!(/^[0-9]{11}$/.test(value))){
                        this.userReg = true;
                        this.user = "用户名由11位数字组成";
                    }else{
                        this.userReg = false;
                        this.flag1 = true;
                    }
                }else {
                    //验证密码
                    var value = this.$refs.pass.value;
                    if (!value.trim() || !value) {
                        this.passReg = true;
                        this.pass = "密码不能为空"
                    } else if (!(/[a-zA-Z0-9_]/g.test(value))) {
                        this.passReg = true;
                        this.pass = "密码由数字、字母或下划线组成";
                    }else if(value.length < 6 || value.length > 12){
                        this.passReg = true;
                        this.pass = "密码长度为6-12位"
                    } else {
                        this.passReg = false;
                        this.flag2 = true;
                    }
                }
                if(this.flag1 && this.flag2){
                    this.flag = true;
                }
            },
            login() {
                if(this.flag) {
                    fetch('/app/userLogin', {
                        method: 'post',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body: `phone=${this.userVal}&pass=${this.passVal}`
                    }).then(res => {
                        return res.json();
                    }).then(res => {
                        if (res.mes == 'ok') {
                            this.$store.commit("setUid",res.uid);
                            localStorage.login = "yes";
                            this.$router.push('/');
                        } else {
                            this.passReg = true;
                            this.pass = "登录失败，请重新登录";
                            setTimeout(()=>{
                                this.passReg = false;
                            },1000)
                        }
                    })
                }else{
                    this.check('user');
                    this.check('pass');
                }
            },
            delLog(){
                this.userVal = "";
                this.passVal = "";
            }
        }
    }
</script>
<style scoped>
    .box{
        position: absolute;
        width: 100%;
        height: 100%;
        background: url("../assets/img/bg.jpg");
    }
    .login{
        width: 80%;
        height: 300px;
        position: absolute;
        top: 0;bottom: 0;left: 0;
        right: 0;
        margin:auto;
        padding: 20px;
        box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);
        border-radius: 10px;
        background: #ffffff;
    }
    h3{
        font-size: 20px;
        text-align: center;
        line-height: 40px;
        margin-bottom: 20px;
    }
    label{
        padding: 11px;
    }
    .twoBtn{
        margin: 30px;
    }
    .mui-btn{
        margin:0 20px;
    }
    p{
        color: red;
    }
</style>