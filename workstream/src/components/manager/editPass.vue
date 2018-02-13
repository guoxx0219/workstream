<template>
    <div class="editPass">
        <h3 class="title">修改密码</h3>
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="旧密码" prop="oldPass">
                <el-input type="password" v-model="ruleForm2.oldPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="newPass">
                <el-input type="password" v-model="ruleForm2.newPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'editPass',
        data() {
            var regPass = (rule,value,callback) => {
                setTimeout(() => {
                    if (value.length < 6) {
                        callback(new Error('密码个数大于6'));
                    } else if(value.length > 18){
                        callback(new Error('密码个数小于18'));
                    } else if (!(/^[a-zA-Z0-9_]{6,18}$/.test(value))){
                        callback(new Error('密码由数字、字母、下划线组成'));
                    }else{
                        callback();
                    }
                }, 1000);
            }
            var checkAge = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('旧密码不能为空'));
                }else {
                    regPass(rule,value,callback);
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.ruleForm2.checkPass !== '') {
                        this.$refs.ruleForm2.validateField('checkPass');
                    }
                    regPass(rule,value,callback);
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                }else if(this.ruleForm2.newPass === ''){
                    callback(new Error('请输入新密码'));
                } else if (value !== this.ruleForm2.newPass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm2: {
                    newPass: '',
                    checkPass: '',
                    oldPass: ''
                },
                rules2: {
                    newPass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    oldPass: [
                        {validator: checkAge, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var oldPass = this.ruleForm2.oldPass;
                        var newPass = this.ruleForm2.newPass;
                        fetch("/app/editPass",{
                            method:'post',
                            headers:{ 'Content-Type': 'application/x-www-form-urlencoded'},
                            body:'apass='+oldPass+'&newpass='+newPass+'&aid='+this.$route.query.aid
                        }).then(res=>{
                            return res.text();
                        }).then(res=>{
                            if(res == 'ok'){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                            }else{
                                this.$message({
                                    message: '修改失败',
                                    type: 'warning'
                                });
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
<style>
    @import "../../assets/css/container.css";
    .editPass{
        padding: 20px;
    }
    .title{
        color: #606266!important;
        margin-left: 20px;
        margin-bottom: 20px;
    }
</style>