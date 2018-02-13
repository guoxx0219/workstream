import Vue from 'vue'
import Router from 'vue-router'
//@表示src目录
import container from '@/components/container'

import login from '@/components/login'

import manager from '@/components/manager/manager'
import addManager from '@/components/manager/addManager'
import editManager from '@/components/manager/editManager'
import editPass from '@/components/manager/editPass'

import manageLevel from '@/components/level/manageLevel'
import addLevel from '@/components/level/addLevel'
import editLevel from '@/components/level/editLevel'

import manageRole from '@/components/role/manageRole'
import addRole from '@/components/role/addRole'
import editRole from '@/components/role/editRole'

import managePart from '@/components/part/managePart'
import addPart from '@/components/part/addPart'
import editPart from '@/components/part/editPart'

import manageUser from '@/components/user/manageUser'
import showUser from '@/components/user/showUser'
import addUser from '@/components/user/addUser'
import userPart from '@/components/user/userPart'

//引入插件
Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'container',
            component: container,
            children:[
                {
                    path:'manager',
                    name:'manager',
                    component:manager
                },{
                    path:'addManager',
                    name:'addManager',
                    component:addManager
                },{
                    path:'editManager',
                    name:'editManager',
                    component:editManager
                },
                {
                    path:'editPass',
                    name:'editPass',
                    component:editPass
                },
                {
                    path:'manageLevel',
                    name:'manageLevel',
                    component:manageLevel
                },
                {
                    path:'addLevel',
                    name:'addLevel',
                    component:addLevel
                },
                {
                    path:'editLevel',
                    name:'editLevel',
                    component:editLevel
                },
                {
                    path:'manageRole',
                    name:'manageRole',
                    component:manageRole
                },
                {
                    path:'addRole',
                    name:'addRole',
                    component:addRole
                },
                {
                    path:'editRole',
                    name:'editRole',
                    component:editRole
                },
                {
                    path:'managePart',
                    name:'managePart',
                    component:managePart
                },
                {
                    path:'addPart',
                    name:'addPart',
                    component:addPart
                },
                {
                    path:'editPart',
                    name:'editPart',
                    component:editPart
                },
                {
                    path:'manageUser',
                    name:'manageUser',
                    component:manageUser,
                    children:[
                        {
                            path:'',
                            name:'',
                            component:showUser,
                        },
                        {
                            path:'/showUser',
                            name:showUser,
                            component:showUser,
                        }
                    ]
                },
                {
                    path:'addUser',
                    name:'addUser',
                    component:addUser,
                    children:[
                        {
                            path:'',
                            name:'',
                            component:userPart,
                        },
                        {
                            path:'/userPart',
                            name:userPart,
                            component:userPart,
                        }
                    ]
                },
            ]
        },
        {
            path:'/login',
            name:'login',
            component:login
        },
        {
            path:'*',
            redirect:'/login'
        }
    ]
})

router.beforeEach((to,from,next)=>{
    if(to.path == '/login'){
        next();
    }else{
        if (sessionStorage.login){
            next();
        }else{
            router.push('/login');
        }
    }
})

export default router;


