<template>
    <div class="main">
        <h3 class="capital">权限管理</h3>
        <el-table
                :data="tableData3"
                height="480"
                border>
        <el-table-column
                prop="lid"
                label="ID">
        </el-table-column>
        <el-table-column
                prop="lname"
                label="权限名称">
        </el-table-column>
        <el-table-column
                prop="lnum"
                label="权限数">
        </el-table-column>
        <el-table-column
                    label="操作">
                <div slot-scope="scope">
                    <el-button type="text" size="small" @click.prevent="edit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click.prevent="del(scope.row.lid,scope.row.lnum)">删除</el-button>
                </div>
        </el-table-column>
    </el-table>
    </div>
</template>
<script>
    export default {
        name:'manageLevel',
        data(){
            return{
                tableData3: []
            }
        },
        methods:{
            edit(data){
                this.$router.push('/editLevel');
                this.$store.commit("level",data);
            },
            del(id,lnum){
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var query = 'id='+id+'&aid='+this.$store.state.aid+'&lnum='+lnum;
                    fetch("/app/delLevel?"+query).then(res=>{
                        return res.text();
                    }).then(res=>{
                        if(res == 'ok'){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.tableData3 = this.tableData3.filter(ele=>ele.lid!=id);
                        }else{
                            this.$message({
                                type: 'info',
                                message: res
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
            fetch('/app/selectLevel').then(function (e) {
                return e.text();
            }).then(res=>{
                this.tableData3 = JSON.parse(res);
            });
        }
    }
</script>
<style>
    @import "../../assets/css/container.css";
</style>