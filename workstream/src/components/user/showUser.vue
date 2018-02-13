<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>所属部门名称</span>
            <el-button style="float: right; padding: 3px 0" type="text" v-show='showBack' @click='back'>后退</el-button>
        </div>
        <div v-for="item in part" :key="item.pid" class="text item">
            <router-link :to="{path:'showUser',query:{id:item.pid}}" v-if="item.son" class="clickLink">{{item.pname}}</router-link>
            <span v-if="!item.son" @click="select(item)" class="select" :style="item.style">{{item.pname}}</span>
        </div>
    </el-card>
</template>
<script>
    export default {
        name:'userPart',
        data(){
            return{
                part:[],
                showBack:false,
                son:true,
                click:false
            }
        },
        methods:{
            select(data){
                this.part.forEach(ele=>{
                    return ele.style = {};
                })
                data.style.color = '#409EFF';
                //选中最小单位部门时，显示表格中的用户信息--单击最小单位部门，理由不会出现跳转
                fetch("/app/showUser?pid="+data.pid).then((e)=> {
                    return e.json();
                }).then(res=>{
                    this.$store.commit("setShowUser",{user:res,show:true});
                });
            },
            back(){
                this.$router.back();
            }
        },
        mounted(){
            var parentid = this.$route.query.id || 0;
            fetch("/app/userPart?parentid="+parentid).then(e=>{
                return e.json();
            }).then(res=>{
                this.part = res;
            })
        },
        watch:{
            $route(){
                var parentid =  this.$route.query.id || 0;
                if(parentid == 0){
                    this.showBack = false;
                }else{
                    this.showBack = true;
                }
                fetch("/app/userPart?parentid="+parentid).then(e=>{
                    return e.json();
                }).then(res=>{
                    this.part = res;
                })
            }
        }
    }
</script>
<style>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .clickLink{
        color: #606266;
        height: auto!important;
    }
    .clickActive{
        color: #409EFF!important;
    }
    .select{
        cursor: pointer;
    }
</style>