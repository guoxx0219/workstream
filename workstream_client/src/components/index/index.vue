<template>
  <div class="hello">
      <Header captical="首页" :showLeft="false" :showRight="false"></Header>
      <!--父组件向子组件传数据-->
      <slide height="200px">
          <a class="one">
              <img src="../../assets/img/1.jpg" alt="">
          </a>
          <a class="one">
              <img src="../../assets/img/2.jpg" alt="">
          </a>
          <a class="one">
              <img src="../../assets/img/3.jpg" alt="">
          </a>
      </slide>
      <news_part :success="showNews">
          <ul class="mui-table-view">
              <li class="mui-table-view-cell" v-for="item in datas">
                  <router-link class="linkNews" tag="a" :to="'/showNews/'+item.nid">
                      {{item.title}}
                  </router-link>
              </li>
          </ul>
      </news_part>
      <Nav></Nav>
  </div>
</template>

<script>
import slide from '@/components/index/slide.vue'
import news_part from '@/components/index/news_part.vue'
import Header from '@/components/header.vue'
import Nav from '@/components/nav.vue'
export default {
    name: 'index',
    //    注册组件
    components:{slide,news_part,Header,Nav},
    data () {
         return {
            datas:[],
         }
    },
    methods:{
        showNews(){
            //flag为真，重新发起请求
            if(this.$store.state.flag){
                var page = this.$store.state.page;
                fetch("/app/newsTit?page="+page+"&num=9").then(e=>{
                    return e.json();
                }).then(res=>{
                    //将每次请求的新闻（数组对象）连接起来，后请求的新闻在前
                    this.datas = res.datas.concat(this.datas);
                    this.$store.commit('setPage',++page);
                })
            }else{
                this.datas = this.$store.state.news;
                //flag为true，表示此时可以请求
                this.$store.commit("setFlag",true);
            }
        }
    },
    //关闭当前组件时，将页面中当前的新闻进行保存
    destroyed(){
        this.$store.commit("setNews",this.datas);
    },
    mounted(){
        this.showNews();
    }
}
</script>


<style scoped>
    .mui-table-view{
        padding: 12px;
    }
    .mui-table-view > li{
        font-size: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
    }
</style>
