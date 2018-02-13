import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //新闻的起始读取位置
        page: 0,
        //页面是否刷新，重新获取数据
        flag:true,
        //保存点击之前的新闻
        news:[],
        //存储选择好的接收人的id
        pid:'',
        //存储选择好的接收人的姓名
        pname:'',
        //存储登录的用户id
        uid:'',
    },
    mutations: {
        setPage (state,val) {
            state.page = val;
        },
        setFlag (state,val) {
            state.flag = val;
        },
        setNews(state,val){
            state.news = val;
        },
        setPid(state,val){
            state.pid = val;
        },
        setPname(state,val){
            state.pname = val;
        },
        setUid(state,val){
            state.uid = val;
        },
    }
})

export default store;