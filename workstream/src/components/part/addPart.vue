<template>
    <div class="main">
        <h3 class="capital">添加部门</h3>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules2" status-icon class="demo-ruleForm">
            <el-form-item label="部门名称" prop="pname">
                <el-input v-model="form.pname" type="text"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" prop="parentid">
                <span @click="first" class="first">一级部门</span>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                <el-button @click="resetForm('form')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name:'addPart',
        data() {
            var checkrname = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('' +
                        '部门名称不能为空'));
                }else{
                    callback();
                }
            };
            return {
                form: {
                    pname: '',
                },
                rules2: {
                    pname: [
                        { validator: checkrname, trigger: 'blur' }
                    ]
                },
                data: [],
//                记录选中时的父元素的信息
                son:[],
                parentid:0,
                flag:false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        methods:{
            first(){
                this.parentid = 0;
                this.flag = true;
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (!this.parentid){
                            this.first();
                        }
                        var query = 'pname='+this.form.pname+'&parentId='+this.parentid;
                        fetch('/app/addPart?'+query).then(e=>{
                            return e.json();
                        }).then(res=>{
                            if(res.mes=='ok'){
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                var obj = {};
                                obj.label = this.form.pname;
                                obj.pid = res.id;
                                obj.children = [];
                                if(this.flag){
                                    this.data.push(obj);
                                    this.flag = false;
                                }else{
                                    this.son.push(obj);
                                }
                            }else{
                                this.$message({
                                    message: '添加失败',
                                    type: 'warning'
                                });
                            }
                            this.form.pname = '';
                        })
                    }
                })
            },
            handleNodeClick(data) {
               this.son = data.children;
               this.parentid = data.pid;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.checkedCities = [];
            }
        },
        mounted(){
            fetch('/app/selectPart').then(res=>{
                return res.json();
            }).then(res=>{
                var arr = [];
                function tree(res,arr,pid) {
                    res.forEach(ele=>{
                        if(ele.parentid == pid){
                            var obj = {};
                            obj.label = ele.pname;
                            obj.pid = ele.pid;
                            obj.children = [];
                            arr.push(obj);
                            tree(res,obj.children,ele.pid);
                        }
                    })
                }
                tree(res,arr,0);
                this.data = arr;
            })
        }
    }
</script>
<style>
   @import "../../assets/css/container.css";
   .el-form-item__content{
       width: 300px;
   }
    .first{
        color: #606266;
        cursor: pointer;
    }
</style>