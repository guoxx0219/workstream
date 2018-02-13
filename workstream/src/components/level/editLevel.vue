<template>
    <div class="main">
        <h3 class="capital">编辑权限</h3>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules2" status-icon class="demo-ruleForm">
            <el-form-item label="权限名称" prop="lname">
                <el-input v-model="form.lname" type="text"></el-input>
            </el-form-item>
            <el-form-item label="权限数" prop="lnum">
                <el-input v-model="form.lnum" type="text"></el-input>
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
        name:'editLevel',
        data() {
            var checklname = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('' +
                        '权限名不能为空'));
                }else{
                    callback();
                }
            };
            var checklnum = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入权限数'));
                } else {
                    callback();
                }
            };
            return {
                id:'',
                form: {
                    lname: '',
                    lnum:''
                },
                rules2: {
                    lname: [
                        { validator: checklname, trigger: 'blur' }
                    ],
                    lnum: [
                        { validator: checklnum, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            onSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.lname == this.form.lname && this.lnum == this.form.lnum){
                              alert('未做更改，提交失败！！')
                        }else{
                            var query = 'lid='+this.id+'&lname='+this.form.lname+'&lnum='+this.form.lnum;
                            fetch('/app/editLevel?'+query).then(res=>{
                                return res.text();
                            }).then(res=>{
                                if(res == 'ok'){
                                    this.$message({
                                        message: '编辑成功',
                                        type: 'success'
                                    });
                                }else{
                                    this.$message({
                                        message: '编辑失败',
                                        type: 'warning'
                                    });
                                }
                                this.form.lname = '';
                                this.form.lnum = '';
                            })
                        }
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName]._props.model.lname = this.lname;
                this.$refs[formName]._props.model.lnum = this.lnum;
            }
        },
        mounted(){
            this.form.lname = this.$store.state.levelInfo.lname;
            this.form.lnum = this.$store.state.levelInfo.lnum;
            this.id = this.$store.state.levelInfo.lid;
        }
    }
</script>
<style>
   @import "../../assets/css/container.css";
    .el-form-item__content{
        width: 300px;
    }
    h3{
        text-align: left!important;
        margin-top: 20px;
        margin-left: 12px;
    }
</style>