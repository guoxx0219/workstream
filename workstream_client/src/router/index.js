import Vue from 'vue'
import Router from 'vue-router'

import css from '../assets/css/mui.css'
import fonts from '../assets/fonts/mui.ttf'

import pinyin_dict_firstletter from '../assets/js/pinyin_dict_firstletter.js'
import pinyinUtil from '../assets/js/pinyinUtil.js'

Vue.use(Router)


import index from '@/components/index/index'
import showNews from '@/components/index/showNews'

import phone from '@/components/phone/phone'

import logs from '@/components/logs/logs'
import message from '@/components/logs/message'
import card from '@/components/logs/card'
import editLogs from '@/components/logs/editLogs'
import selectPerson from '@/components/logs/selectPerson'

import setting from '@/components/setting/setting'
import editPass from '@/components/setting/editPass'
import editUname from '@/components/setting/editUname'

import login from '@/components/login'

const router =  new Router({
    linkExactActiveClass:'mui-active',
    routes: [
        {
            path: '/',
            name: 'index',
            component: index
        },
        {
            path: '/showNews/:id',
            name: 'showNews',
            component: showNews
        },
        {
            path: '/phone',
            name: 'phone',
            component:phone
        },
        {
            path: '/logs',
            component: logs,
            children:[
                {
                    path: '/',
                    name: 'message',
                    component:message,
                    redirect:'/kind/send',
                    children:[
                        {
                            path:'/kind/:type',
                            component:card,
                        },
                    ]
                },
                {
                    path:'/editLogs',
                    name:'editLogs',
                    component:editLogs,
                },
                {
                    path:'/selectPerson/:id',
                    component:selectPerson,
                }
            ]
        },
        {
            path: '/setting',
            name: 'setting',
            component:setting,
        },
        {
            path:"/editPass",
            name:'editPass',
            component:editPass
        },
        {
            path:"/editUname",
            name:'editUname',
            component:editUname
        },
        {
            path:'/login',
            name:'login',
            component:login
        },
        {
            path:'*',
            redirect:'/'
        }
    ]
})

router.beforeEach((to,from,next)=>{
    if(to.path == "/login"){
        next();
    }else{
        if(localStorage.login == "yes"){
            next();
        }else{
            router.push('/login');
        }
    }
})

export default router;
