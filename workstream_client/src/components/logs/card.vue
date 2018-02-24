<template>
    <div class="given">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click="back"></a>
            <h1 class="mui-title">日志</h1>
            <router-link class="mui-icon mui-icon-compose mui-icon-right-nav mui-pull-right" to="/editLogs"></router-link>
        </header>
        <div class="mui-card" v-for="item in given" :key="item.ltime">
            <!--页眉，放置标题-->
            <div class="mui-card-header mui-card-media">
                <img :src="'http://localhost:8888/'+item.photo" alt="">
                <div class="mui-media-body">
                    {{mes}}：{{item.uname}}
                    <p>发送于 {{item.ltime}}</p>
                </div>
            </div>
            <!--内容区-->
            <div class="mui-card-content title">标题：{{item.title}}</div>
            <!--页脚，放置补充信息或支持的操作-->
            <div class="mui-card-footer">
                <p>内容：{{item.con}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import moment from 'moment-timezone'
    Vue.use(moment)

    export default {
        name:'card',
        data(){
            return{
                given:[],
                img:""
            }
        },
        watch:{
            $route(){
                var type = this.$route.params.type;
                if(type == "send"){
                    this.mes = "发送至";
                }else {
                    this.mes = "接受自"
                }
                //当前用户的id
                var uid1 = this.$store.state.uid;
                fetch("/app/selectGive?uid1="+uid1+"&type="+type).then(e=>{
                    return e.json();
                }).then(res=>{
                    res.forEach(ele=>{
                        var timezone = "Asia/Shanghai";
                        ele.ltime = moment(ele.ltime).tz(timezone).format('YYYY-MM-DD hh:mm:ss');
                        return ele.ltime;
                    });
                    this.given = res;
                })
            }
        },
        mounted(){
            this.mes = "发送至"
            var uid1 = this.$store.state.uid;
            fetch("/app/selectGive?uid1="+uid1+"&type=send").then(e=>{
                return e.json();
            }).then(res=>{
                res.forEach(ele=>{
                    var timezone = "Asia/Shanghai";
                    ele.ltime = moment(ele.ltime).tz(timezone).format('YYYY-MM-DD hh:mm:ss');
                    return ele.ltime;
                });
                this.given = res;
            })
        },
        methods:{
            back(){
                this.$router.push("/");
            },
        }
    }
</script>
<style scoped>
    .mui-media-body{
        text-align: left;
    }
    .given{
        margin: 20px auto;
    }
    .mui-card{
        border-radius: 5px;
        text-align: left !important;
    }
    .title{
        padding:10px 15px!important;
        line-height: 1;
        text-align: center;
    }
    .mui-card-footer>p{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:3;
        overflow: hidden;
    }
</style>