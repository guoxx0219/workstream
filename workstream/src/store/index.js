import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //编辑对应的权限信息
        levelInfo: {},
        // 编辑对应的角色信息
        roleInfo: {},
        //所有权限信息
        levels:[],
        aname:'',
        aid:'',
        adminInfo:{},
        // 编辑时当前部门信息
        partInfo:{},
        //所有部门信息
        allPartInfo:[],
        //在选择部门之前不能填写用户名
        flag:true,
        //添加用户时选择的部门id
        selectPid:'',
    //    查找用户时选择的部门id
        showUser:{user:[],show:false}
    },
    mutations: {
        level (state,val) {
            state.levelInfo.lname = val.lname;
            state.levelInfo.lnum = val.lnum;
            state.levelInfo.lid = val.lid;
        },
        role (state,val) {
            state.roleInfo.mname = val.data.mname;
            state.roleInfo.rid = val.data.rid;
            state.roleInfo.lid = val.data.lid;
            state.levels = val.levels;
        },
        setAname(state,val){
            state.aname = val;
        },
        setAid(state,val){
            state.aid = val;
        },
        admin(state,val) {
            state.adminInfo.aid = val.aid;
            state.adminInfo.aname = val.aname;
            state.adminInfo.photo = val.photo;
            state.adminInfo.mname = val.mname;
        },
        part(state,val) {
            state.partInfo.label = val.label;
            state.partInfo.pid = val.pid;
            state.partInfo.parentid = val.parentid;
            state.partInfo.children = val.children;
        },
        allPart(state,val){
            state.allPartInfo = val;
        },
        flag(state,val){
            state.flag = val;
        },
        setPid(state,val){
            state.pid = val;
        },
        setUserPid(state,val){
            state.selectPid = val;
        },
        setShowUser(state,val){
            state.showUser = val;
        }
    },
    actions:{
        setAname(context,val){
            context.commit('setAname',val);
        }
    }
})

export default store;