<template>
    <div class="main">
        <h3 class="capital">编辑管理员</h3>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules2" status-icon class="demo-ruleForm">
            <el-form-item label="管理员名" prop="aname">
                <el-input v-model="form.aname" type="text"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="role" class="radio">
                <el-radio-group v-model="role" v-for="item in roles" :key="item.rid">
                    <el-radio :label="item.rid">{{item.mname}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上传头像" prop="aname" class="upload">
                <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        action="/app/upload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-input v-model="img" type="hidden"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
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
                        '管理员名称不能为空'));
                }else{
                    callback();
                }
            };
            return {
                form: {
                    aname: '',
                },
                rules2: {
                    aname: [
                        { validator: checklname, trigger: 'blur' }
                    ],
                },
               // 存放本地图片路径
                imageUrl:'',
                // 存放服务器返回的图片路径
                img:'',
                //单选按钮的结果
                role:'',
                //所有单选按钮的值
                roles:[],
                id:''
            }
        },
        methods:{
            onSubmit(){
                if(!this.img){
                    this.img = this.$store.state.adminInfo.photo.split('http://localhost:8888/')[1];
                }
                fetch('/app/editManager',{
                    method:'post',
                    headers:{ 'Content-Type': 'application/x-www-form-urlencoded'},
                    body:'aid='+this.id+'&aname='+this.form.aname+'&rid='+this.role+'&img='+this.img
                }).then(res=>{
                    return res.text();
                }).then(res=>{
                    if(res == 'ok'){
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }else{
                        this.$message({
                            type: 'warning',
                            message: '修改失败!'
                        });
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.img = file.response;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        },
        mounted(){
            var admin = this.$store.state.adminInfo;
            this.form.aname = admin.aname;
            this.imageUrl = admin.photo;
            this.id = admin.aid;
            fetch("/app/findRole").then(res=>{
                return res.json();
            }).then(res=>{
                this.roles = res;
                res.forEach((ele,index)=>{
                    if(ele.mname == admin.mname){
                        this.role = index+1;
                    }
                })
            })
        }
    }
</script>
<style>
   @import "../../assets/css/container.css";
   @import "../../assets/css/img.css";
    .el-form-item__content{
        width: 300px;
    }
    h3{
        text-align: left!important;
        margin-top: 20px;
        margin-left: 12px;
    }
    .radio{
        height: auto!important;
    }
    .upload{
        height: 180px;
    }
    .el-form-item__label{
        color: #606266;
    }
</style>