<template>
    <div class="main">
        <h3 class="capital">编辑部门</h3>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules2" status-icon class="demo-ruleForm">
            <el-form-item label="部门名称" prop="pname">
                <el-input v-model="form.pname" type="text"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" prop="parent">
                <el-input v-model="form.parent" type="text" disabled></el-input>
            </el-form-item>
            <el-form-item label="所有部门" prop="parentid">
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
        name:'editPart',
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
                id:'',
                form: {
                    pname: '',
                    parent:''
                },
                rules2: {
                    pname: [
                        { validator: checkrname, trigger: 'blur' }
                    ]
                },
                data: [],
//                记录选中时的父元素的信息
                son:[],
//                标识一级部门是否选择
                flag:false,
                parentid:0,
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
                        var query = 'pid='+this.id+'&pname='+this.form.pname+'&parentid='+this.parentid;
                        fetch('/app/editPart?'+query).then(e=>{
                            return e.text();
                        }).then(res=>{
                            if(res=='ok'){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                var obj = {};
                                obj.label = this.form.pname;
                                obj.pid = '';
                                obj.children = [];
                                if(this.form.parent == '一级部门'){
                                    this.data = this.data.filter(ele=>ele.pid != this.id)
                                }
                                if(this.parentid == 0){
                                    this.data.push(obj);
                                }else{
                                    this.son.push(obj);
                                }
                            }else{
                                this.$message({
                                    message: '修改失败',
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
            this.id = this.$store.state.partInfo.pid;
            this.parentid = this.$store.state.partInfo.parentid;
            this.form.pname = this.$store.state.partInfo.label;
            this.data = this.$store.state.allPartInfo;
            fetch("/app/selectParent?pid="+this.parentid).then(e=>{
                return e.text();
            }).then(res=>{
                this.form.parent = res;
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