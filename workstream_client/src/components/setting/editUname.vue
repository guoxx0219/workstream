<template>
    <div>
        <Header captical="修改用户名" :showLeft="true" :showRight="false"></Header>
        <div class="setCon editPass">
            <form class="mui-input-group">
                <div class="mui-input-row">
                    <label>用户名</label>
                    <input type="text" class="mui-input-clear" placeholder="请输入用户名" @blur="check_uname" ref="uname" v-model="uname">
                </div>
                <p class="tishi">{{tishi}}</p>
            </form>
            <div class="editbut">
                <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined" @click="onSubmit">提交</button>
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
                tishi:"",
                //提示信息
                mes:"",
                uname:"",
                //旧的用户名
                old:''
            }
        },
        methods:{
            check_uname(){
                if(!this.uname.trim() || !this.uname){
                    this.tishi = "用户名不能为空";
                }else if(this.uname == this.old){
                    this.tishi = "没有对用户名进行更改"
                }else{
                    this.flag = true;
                    this.tishi = "";
                }
            },
            onSubmit(){
                if(!this.flag){
                    this.check_uname();
                }else{
                    var str = 'uname='+this.uname+'&uid='+this.$store.state.uid;
                    fetch("/app/editUname?"+str).then(e=>{
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
        },
        mounted(){
            fetch("/app/selectUname?uid="+this.$store.state.uid).then(e=>{
                return e.json();
            }).then(res=>{
                this.uname = res.uname;
                this.old = this.uname;
            })
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