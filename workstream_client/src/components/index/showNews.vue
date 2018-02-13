<template>
    <div class="showNews">
        <Header showLeft="true" :captical="title"></Header>
        <div class="main">
            <p>{{con}}</p>
        </div>
    </div>
</template>
<script>
    import Header from '@/components/header.vue'
    export default {
        name:'showNews',
        components:{Header},
        data(){
            return{
                title:'',
                con:'',
                nid:''
            }
        },
        mounted(){
            this.nid = this.$route.params.id;
            fetch("/app/newsCon?nid="+this.nid).then(e=>{
                return e.json();
            }).then(res=>{
                this.title = res.datas.title;
                this.con = res.datas.con;
            })
        }
    }
</script>
<style>
    .showNews{
        width: 100%;
        padding-top: 44px;
    }
    .main{
        padding: 20px;
    }
    .main p{
        line-height: 24px;
        letter-spacing: 1.6px;
    }
</style>