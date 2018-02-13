<template>
    <div class="main">
        <h3 class="capital">角色对应权限信息</h3>
        <el-table
                :data="tableData3"
                height="480"
                border>
        <el-table-column
                prop="rid"
                label="ID">
        </el-table-column>
        <el-table-column
                prop="mname"
                label="角色名称">
        </el-table-column>
        <el-table-column
                prop="lid"
                label="权限数">
        </el-table-column>
        <el-table-column
                    label="操作">
                <div slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="delRole(scope.row.rid)">删除</el-button>
                </div>
        </el-table-column>
    </el-table>
    </div>
</template>
<script>
    export default {
        name:'manageRole',
        data(){
            return{
                tableData3: [],
                levels:[]
            }
        },
        methods:{
            edit(data){
                var obj = {data,'levels':this.levels};
                this.$store.commit('role',obj);
                this.$router.push('editRole');
            },
            delRole(id){
                var aid = this.$store.state.aid;
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    fetch("/app/delRole?rid="+id+'&aid='+aid).then(res=>{
                        return res.text();
                    }).then(res=>{
                        if(res == 'ok'){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.tableData3 = this.tableData3.filter(ele=>ele.rid!=id);
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
            fetch('/app/selectRole').then(res=>{
                return res.text();
            }).then(res=>{
                this.levels = JSON.parse(res).slice(-1)[0].levels;
                this.tableData3 = JSON.parse(res).slice(0,-1);
            })
        }
    }
</script>
<style>
    @import "../../assets/css/container.css";
</style>