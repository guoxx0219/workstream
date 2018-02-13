<template>
    <div class="addUser">
        <h3 class="capital">添加用户</h3>
        <router-view></router-view>
        <el-upload
                class="upload-demo"
                action="/app/uploadUser"
                multiple
                :limit="3"
                :file-list="fileList"
                :on-success="success"
        style="margin-bottom: 20px;padding-left: 20px;">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules2" status-icon class="demo-ruleForm">
            <el-form-item label="用户名" prop="user">
                <el-input v-model="form.user" type="text" :disabled='flag'></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="phone">
                <el-input v-model="form.phone" type="text" :disabled='flag'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit()">添加</el-button>
                <el-button @click="resetForm('form')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name:'addUser',
        data(){
            var checkrname = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('' +
                        '用户名不能为空'));
                }else{
                    callback();
                }
            };
            var checkphone = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('' +
                        '电话号码不能为空'));
                }
                setTimeout(() => {
                    if (value.length != 11) {
                        callback(new Error('请输入11位数字'));
                    }else if (!(typeof (value*1))){
                        callback(new Error('只能输入数字'));
                    }else{
                        callback();
                    }
                }, 1000);
            };
            return{
                form:{
                    user:'',
                    phone:''
                },
                rules2: {
                    user: [
                        { validator: checkrname, trigger: 'blur' }
                    ],
                    phone: [
                        { validator: checkphone, trigger: 'blur' }
                    ]
                },
                fileList: []
            }
        },
        computed:{
            flag(){
                return this.$store.state.flag;
            }
        },
        methods:{
            onSubmit(){
                var uname = this.form.user;
                var phone = this.form.phone;
                var pid = this.$store.state.selectPid;
                var query = 'uname='+uname+'&phone='+phone+'&pid='+pid;
                fetch("/app/addUser?"+query).then(e=>{
                    return e.text();
                }).then(res=>{
                    if(res=='ok'){
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: '添加失败',
                            type: 'warning'
                        });
                    }
                    this.form.user = '';
                    this.form.phone = '';
                    this.form.validateevent = false;
                })
            },
            success(res){
                console.log(res)
            }
        }
    }
</script>
<style>
    .addUser{
        color: #606266;
        padding: 20px;
    }
    .capital{
        color: #606266!important;
        margin-bottom: 20px;
    }
</style>