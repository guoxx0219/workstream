<!--<script src="../../../vue.js/life/table/light/static/js/component.js"></script>-->
<template>
    <div class="login">
        <h3>登录界面</h3>
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="user">
                <el-input type="text" v-model="ruleForm2.user"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
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
        name:'login',
        data() {
            var checkUser = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('用户名不能为空'));
                }else{
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm2: {
                    pass: '',
                    user: ''
                },
                rules2: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    user: [
                        { validator: checkUser, trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        fetch('/app/login',{
                            method:'post',
                            headers:{ 'Content-Type': 'application/x-www-form-urlencoded'},
                            body:`name=${this.ruleForm2.user}&pass=${this.ruleForm2.pass}`
                        }).then(res=>{
                            return res.json();
                        }).then(res=>{
                            if(res.mes == 'ok'){
                                this.$message({
                                    message: '登陆成功',
                                    type: 'success'
                                });
                                sessionStorage.login = 'yes';
                                this.$store.dispatch("setAname",res.result[0].aname);
                                this.$store.commit("setAid",res.result[0].aid);
                                sessionStorage.aname = res.result[0].aname;
                                sessionStorage.aid = res.result[0].aid;
                                this.$router.push('/');
                            }else{
                                this.$message({
                                    message: '登录失败',
                                    type: 'warning'
                                });
                                this.ruleForm2.user = '';
                                this.ruleForm2.pass = '';
                            }
                        })
                    } else {
                        alert('提交失败！！');
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
<style scoped>
    .login{
        width: 500px;
        height: 300px;
        position: absolute;
        top: 0;bottom: 0;left: 0;
        right: 0;
        margin:auto;
        padding: 20px;
        box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);
        border-radius: 10px;
        background: rgba(0,0,0,0.7);
    }
    form{
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    .el-form-item{
        height: 40px;
    }
    .el-form-item__label{
        color: #ffffff;
    }
    h3{
        font-size: 20px;
        text-align: center;
        line-height: 40px;
        margin-bottom: 20px;
    }
</style>