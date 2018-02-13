<template>
    <div class="editLogs">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click="back"></a>
            <h1 class="mui-title">日志</h1>
            <router-link class="mui-icon mui-icon-compose mui-icon-right-nav mui-pull-right" to="/editLogs"></router-link>
        </header>
        <div class="person">
            <div class="mui-input-row mui-search">
                <input type="text" class="mui-input-clear" placeholder="请选择收件人" v-model="user2">
            </div>
            <router-link class="mui-icon mui-icon-person person-icon" tag="a" to="/selectPerson/0"></router-link>
        </div>
        <div class="mui-input-row">
            <label>标题</label>
            <input type="text" class="mui-input-clear" placeholder="请输入标题" v-model="title">
        </div>
        <div class="mui-input-row">
            <label>内容</label>
            <textarea class="mui-input-clear" placeholder="请输入内容" v-model="con"></textarea>
        </div>
        <div class="but">
            <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined" @click="onSubmit">发送</button>
            <button type="button" class="mui-btn mui-btn-outlined" @click="cancel">取消</button>
        </div>
    </div>
</template>
<script>
    import Header from '@/components/header.vue'
    export default {
        name:'editLogs',
        components:{Header},
        data(){
            return{
                //接收者的姓名和id
                user2:"",
                uid2:'',
                title:'',
                con:''
            }
        },
        methods:{
            back(){
                this.$router.push("/");
            },
            onSubmit(){
                var pid = this.$store.state.pid;
                var uid1 = this.$store.state.uid;
                var query = "uid1="+uid1+'&uid2='+this.uid2+"&title="+this.title+"&con="+this.con;
                fetch("/app/giveLogs",{
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body:query
                }).then(e=>{
                    return e.text();
                }).then(res=>{
                    if(res == "ok"){
                        this.$router.push('/kind/send');
                    }else{
                        alert("发送失败");
                    }
                })
            },
            cancel(){
                this.user2 = "";
                this.uid = "";
                this.title = "";
                this.con = "";
            }
        },
        mounted(){
            this.user2 = this.$store.state.pname;
            this.uid2 = this.$store.state.pid;
        }
    }
</script>
<style>
    .editLogs{
        padding: 30px 20px;
    }
    .mui-input-row{
        border: 1px solid #9e9e9e36!important;
        border-radius: 5px!important;
        margin-bottom: 20px;
        background: #ffffff!important;
    }
    input{
        width: 75% !important;
        border: 0;
        outline: none;
    }
    label{
        width: 25% !important;
        padding: 12px  0px!important;
    }
    textarea{
        width: 75% !important;
        height: 200px;
        background: none;
    }
    .mui-search{
        width: 85% !important;
        border:none!important;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .mui-search>input{
        width: 100% !important;
        height: 100%!important;
        background: none;
        border-radius: 5px!important;
        margin-bottom: 0px!important;
    }
    .person{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .person-icon{
        display: block;
        font-size: 32px;
        padding-bottom: 20px;
    }
    .but{
        padding: 20px;
    }
    .mui-btn{
        padding: 10px 20px;
        margin:0 30px;
    }
</style>