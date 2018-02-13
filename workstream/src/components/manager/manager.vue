<template>
    <div class="main">
        <h3 class="capital">管理员信息</h3>
        <el-table
                :data="tableData3"
                height="480"
                border>
        <el-table-column
                prop="aid"
                label="ID">
        </el-table-column>
        <el-table-column
                prop="aname"
                label="用户名">
        </el-table-column>
        <el-table-column
                prop="photo"
                label="头像">
            <div slot-scope="scope" class="imgBox">
                <img alt="" :src="scope.row.photo">
            </div>
        </el-table-column>
        <el-table-column
                prop="mname"
                label="角色">
        </el-table-column>
        <el-table-column
                    label="操作">
                <div slot-scope="scope">
                    <el-button type="text" size="small" @click="editManager(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" v-if="scope.row.aid==1 || showEditPass" @click="editPass(scope.row.aid)">修改密码</el-button>
                    <el-button type="text" size="small" v-show="showDel" v-if="scope.row.aid!=1" @click="delManager(scope.row.aid)">删除</el-button>
                </div>
        </el-table-column>
    </el-table>
    </div>
</template>
<script>
    export default {
        name:'manager',
        data(){
            return{
                tableData3: [],
                showEditPass:false,
                showDel:false
            }
        },
        methods:{
            editPass(aid){
                this.$router.push('/editPass?aid='+aid);
            },
            editManager(data){
                var obj = {};
                obj.aid = data.aid;
                obj.aname = data.aname;
                obj.photo = data.photo;
                obj.mname = data.mname;
                this.$store.commit('admin',obj);
                this.$router.push('editManager');
            },
            delManager(aid){
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    fetch("/app/delManager?id="+aid).then(res=>{
                        return res.text();
                    }).then(res=>{
                        if(res == 'ok'){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.tableData3 = this.tableData3.filter(ele=>ele.aid!=aid);
                        }else{
                            this.$message({
                                type: 'info',
                                message: '删除失败!'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        mounted(){
            this.$store.state.aid = sessionStorage.aid;
            var aid = this.$store.state.aid;
            if(aid == 1){
                this.showDel = true;
            }else{
                this.showEditPass = true;
            }
            fetch('/app/selectAdmin?aid='+aid).then(res=>{
                return res.text();
            }).then(res=>{
                var arr = JSON.parse(res);
                arr.forEach(ele=>{
                    ele.photo = "http://localhost:8888/"+ele.photo;
                });
                this.tableData3 = arr;
            })
        }
    }
</script>
<style>
    @import "../../assets/css/container.css";
    .imgBox{
        height: 60px;
    }
    .imgBox>img{
        display: block;
        height: 100%;
    }
</style>