<template>
    <div class="select">
        <Header captical="发送至" :showLeft="true" :showRight="false"></Header>
        <ul class="mui-table-view" v-show="showPart">
            <li class="mui-table-view-cell" v-for="item in part" :key="item.pid">
                <router-link class="mui-navigate-right" tag="a" :to="'/selectPerson/'+item.pid" v-show="item.son">{{item.pname}}</router-link>
                <span class="mui-navigate-right" v-show="!item.son" @click="selectPid(item.pid)">{{item.pname}}</span>
            </li>
        </ul>
        <ul class="mui-table-view" v-show="showUser">
            <li class="mui-table-view-cell" v-for="item in user" :key="item.uid">
                <span class="mui-navigate-right" @click="selectUser(item)">{{item.uname}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
    import Header from '@/components/header.vue'
    export default {
        name:'selectPerson',
        components:{Header},
        data(){
            return{
                part:[],
                user:[],
                showPart:true,
                showUser:false
            }
        },
        methods:{
            selectPid(pid){
                fetch("/app/partUser?pid="+pid).then(e=>{
                    return e.json();
                }).then(res=>{
                    this.showUser = true;
                    this.showPart = false;
                    this.user = res;
                })
            },
            selectUser(data){
                this.$store.commit("setPid",data.uid);
                this.$store.commit("setPname",data.uname);
                this.$router.push('/editLogs');
            }
        },
        mounted(){
            fetch("/app/userPart?parentid=0").then(e=>{
                return e.json();
            }).then(e=>{
                this.showPart = true;
                this.showUser = false
                this.part = e;
            })
        },
        watch:{
            //本页面的路由发生变化时，才会响应，首次进页面不会触发，所以有mounted
            $route(){
                var pid= this.$route.params.id;
                fetch("/app/userPart?parentid="+pid).then(e=>{
                    return e.json();
                }).then(e=>{
                    this.part = e;
                })
            }
        }
    }
</script>
<style>
    .select{
        padding: 20px 0;
    }
    span.mui-navigate-right::after{
        content: ""!important;
    }
</style>