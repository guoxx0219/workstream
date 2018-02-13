<template>
    <div>
        <Header captical="修改密码" :showLeft="true" :showRight="false"></Header>
        <div class="setCon editPass">
            <form class="mui-input-group">
                <div class="mui-input-row">
                    <label>旧密码</label>
                    <input type="password" class="mui-input-clear" placeholder="请输入旧密码" @blur="check_oldpass" ref="oldpass">
                </div>
                <p class="tishi">{{oldpass}}</p>
                <div class="mui-input-row">
                    <label>新密码</label>
                    <input type="password" class="mui-input-clear" placeholder="请输入新密码" @blur="check_newpass" ref="newpass">
                </div>
                <p class="tishi">{{newpass}}</p>
                <div class="mui-input-row">
                    <label>确认密码</label>
                    <input type="password" class="mui-input-clear" placeholder="请再次输入密码" @blur="check_request" ref="request">
                </div>
                <p class="tishi">{{request}}</p>
            </form>
            <div class="editbut">
                <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined" @click="onSubmit">提交</button>
                <button type="button" class="mui-btn mui-btn-outlined" @click="cancel">取消</button>
            </div>
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
        components:{Header},
        data(){
            return{
                flag:false,
                oldpass:"",
                flag1:false,
                newpass:"",
                flag2:false,
                request:"",
                flag3:false,
                pass:"",
                //提示信息
                mes:""
            }
        },
        methods:{
            check_oldpass(){
                var value = this.$refs.oldpass.value || "";
                if(!value.trim() || !value){
                    this.oldpass = "旧密码不能为空！";
                    return;
                }else {
                    var query = 'upass='+value+'&uid='+this.$store.state.uid;
                    fetch("/app/regPass?"+query).then(e=>{
                        return e.text();
                    }).then(res=>{
                        if(res != "ok"){
                            this.oldpass = "旧密码输入错误！"
                        }else{
                            this.flag1 = true;
                            this.oldpass = "";
                        }
                    })
                }
            },
            check_newpass(e){
                var value = this.$refs.newpass.value || "";
                if (!value.trim() || !value) {
                    this.newpass = "密码不能为空！"
                } else if (!(/[a-zA-Z0-9_]/g.test(value))) {
                    this.newpass = "密码由数字、字母或下划线组成";
                }else if(value.length < 6 || value.length > 12){
                    this.newpass = "密码长度为6-12位"
                } else {
                    this.pass = value;
                    this.flag2 = true;
                    this.newpass = "";
                }
            },
            check_request(e){
                var value = this.$refs.request.value || "";
                if(!value.trim() || !value) {
                    this.request = "请再次输入新密码！";
                    return;
                }else if(value == this.pass){
                    this.flag3 = true;
                }else{
                    this.request = "两次密码输入不一致！";
                }
                if(this.flag1 && this.flag2 && this.flag3){
                    this.flag = true;
                    this.request = "";
                }
            },
            onSubmit(){
                if(!this.flag){
                    if(!this.flag1){
                        this.check_oldpass();
                    }else if(!this.flag2){
                        this.check_newpass();
                    }else{
                        this.check_request();
                    }
                }else{
                    var str = 'upass='+this.pass+'&uid='+this.$store.state.uid;
                    fetch("/app/editPass?"+str).then(e=>{
                        return e.text();
                    }).then(res=>{
                        if(res == "ok"){
                            this.mes = '修改成功';
                            this.$router.push("/setting");
                        }else{
                            this.mes = '修改失败';
                        }
                        setTimeout(()=>{
                            this.mes = '';
                        },2000);
                        this.flag = false;
                    })
                }
            },
            cancel(){
                this.$refs.oldpass.value = "";
                this.$refs.newpass.value = "";
                this.$refs.request.value = "";
                this.flag1 = false;
                this.flag2 = false;
                this.flag3 = false;
            }
        }
    }
</script>
<style>
    .setCon{
        padding-top: 44px;
    }
    .editPass{
        margin-top: 20px;
    }
    .editbut{
        margin: 20px;
    }
    button{
        margin: 20px;
        display: inline-block;
    }
    .tishi{
        color: red;
    }
    form{
        padding-bottom: 20px!important;
        padding-top: 20px!important;
    }
    .mes{
        width: 80%;
        height: 100px;
        background: rgba(0,0,0,0.6);
        color: #ffffff;
        text-align: center;
        line-height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin:auto;
        z-index: 50;
        border-radius: 10px;
    }
</style>