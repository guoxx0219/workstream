<template>
    <el-container>
        <el-header>
            <div class="header-img">
                <img src="../assets/img/1.jpg" alt="">
                <h4>{{aname}}</h4>
            </div>
            <h3>工作流APP后台管理系统</h3>
            <div class="right">
                <el-button type="private" class="signOut" @click="signOut">退出</el-button>
                <el-button type="success" class="signOut" @click="signOut">前台</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-col>
                    <el-menu
                            default-active="2"
                            class="el-menu-vertical-demo"
                            background-color="rgb(67,74,80)"
                            text-color="#fff">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>管理员管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="1-1">
                                    <router-link to="manager" class="activeA">查看管理员</router-link>
                                </el-menu-item>
                                <el-menu-item index="1-2">
                                    <router-link to="addManager" class="activeA">添加管理员</router-link>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>角色管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="1-1">
                                    <router-link to="manageRole" class="activeA">查看角色
                                    </router-link>
                                </el-menu-item>
                                <el-menu-item index="1-2">
                                    <router-link to="addRole" class="activeA">添加角色
                                    </router-link>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>权限管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="1-1">
                                    <router-link :to="{name:'manageLevel'}" class="activeA">查看权限</router-link>
                                </el-menu-item>
                                <el-menu-item index="1-2" >
                                    <router-link to="addLevel" class="activeA">添加权限</router-link>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="4">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>部门管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="1-1">
                                    <router-link :to="{name:'managePart'}" class="activeA">查看部门</router-link>
                                </el-menu-item>
                                <el-menu-item index="1-2" >
                                    <router-link to="addPart" class="activeA">添加部门</router-link>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="5">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>用户管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="1-1">
                                    <router-link to="manageUser" class="activeA">查看用户
                                    </router-link>
                                </el-menu-item>
                                <el-menu-item index="1-2">
                                    <router-link to="addUser" class="activeA">添加用户
                                    </router-link>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-col>
            </el-aside>
            <router-view></router-view>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        name:'container',
        data(){
            return{
                aname:''
            }
        },
        methods:{
            signOut(){
                sessionStorage.removeItem('login');
                sessionStorage.removeItem('aname');
                this.$router.push('/login');
            }
        },
        mounted(){
            this.$store.state.aname = sessionStorage.aname;
            this.aname = sessionStorage.aname;
            this.$store.state.aid = sessionStorage.aid;
        }
    }
</script>
<style>
    .el-container{
        width: 100%;
        height: 100%;
        background: #ffffff;
    }
    .el-header{
        background-color:rgba(67,74,80,0.9);
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 60px;
        height: 14% !important;
        padding: 0 60px;
    }
    .el-header>.header-img{
        width: 140px;
        height: 100%;
        display: flex;
       justify-content: space-between;
        align-items: center;
    }
    .header-img>img{
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    .header-img>img:hover{
        animation: rotate 3s ease-out;
    }
    .el-aside,.el-main{
        height: 100% !important;
    }
    .el-aside {
        width: 200px!important;
        color: #ffffff;
        text-align: center;
        background: rgb(67,74,80);
    }
    .el-submenu__title{
        background: rgb(67,74,80) !important;
    }
    .el-submenu__title:hover{
        background: rgb(84,92,100)!important;
    }
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
    }
    .activeA{
        color: rgb(255, 255, 255);
        height: 50px;
        display: block;
        width: 100%;
    }
    .signOut{
        height: 30px;
        line-height: 30px;
        padding:0 12px;
    }
    .right{
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    h3{
        margin-bottom: 0;
        color: #ffffff!important;
    }
    @keyframes rotate {
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
</style>