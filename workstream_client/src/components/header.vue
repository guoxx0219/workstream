<template>
    <header class="mui-bar mui-bar-nav" captical>
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click="back" v-show="showLeft"></a>
        <h1 class="mui-title">{{captical}}</h1>
        <router-link class="mui-icon mui-icon-compose mui-icon-right-nav mui-pull-right" v-show="showRight" to="/editLogs"></router-link>
    </header>
</template>
<script>
    export default {
        name:'Header',
        props:['captical','showLeft','showRight'],
        data(){
            return{

            }
        },
        methods:{
            back(){
                this.$router.go(-1);
                //flag为false，此时showNews不可以请求
                this.$store.commit("setFlag",false);
            }
        }
    }
</script>
<style>
</style>