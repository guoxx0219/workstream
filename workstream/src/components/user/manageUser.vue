<template>
    <div class="addUser">
        <h3 class="capital">用户信息</h3>
        <router-view></router-view>
        <el-table
                class="mytable"
                :data="tableData3"
                max-height="480"
                border v-show="show">
            <el-table-column
                    prop="uid"
                    label="ID">
            </el-table-column>
            <el-table-column
                    prop="uname"
                    label="用户名">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机号码">
            </el-table-column>
            <el-table-column
                    prop="photo"
                    label="用户头像">
                <div slot-scope="scope" class="imgBox">
                    <img alt="" :src="'http://localhost:8888/'+scope.row.photo">
                </div>
            </el-table-column>
            <el-table-column
                    prop="pname"
                    label="所属部门">
            </el-table-column>
            <el-table-column
                    label="操作">
                <div slot-scope="scope">
                    <el-button type="text" size="small">删除</el-button>
                </div>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        name:'manageUser',
        data(){
            return{
                show:''
            }
        },
        computed:{
            tableData3(){
                var showInfo = this.$store.state.showUser;
                this.show = showInfo.show;
                return showInfo.user;
            }
        },
        mounted(){
            this.$store.commit('setShowUser',{user:[],show:false});
        },
        watch:{
            $route(){
                //路由一旦出现跳转，不在显示表格中的用户信息
                this.$store.commit('setShowUser',{user:[],show:false});
            }
        }
    }
</script>
<style>
    @import "../../assets/css/container.css";
    .mytable{
        height: auto!important;
    }
    .addUser{
        width: 100%;
        color: #606266;
        padding: 20px;
    }
    .capital{
        color: #606266!important;
        margin-bottom: 20px;
    }
</style>