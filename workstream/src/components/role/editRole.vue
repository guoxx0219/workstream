<template>
    <div class="main">
        <h3 class="capital">修改角色</h3>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules2" status-icon class="demo-ruleForm">
            <el-form-item label="角色名称" prop="mname">
                <el-input v-model="form.mname" type="text"></el-input>
            </el-form-item>
            <div class="check">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" :min="1">
                    <el-checkbox v-for="item in levels" :label="item.lnum" :key="item.lid">{{item.lname}}</el-checkbox>
                </el-checkbox-group>
            </div>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                <el-button @click="resetForm('form')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name:'editRole',
        data() {
            var checkrname = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('' +
                        '角色名称不能为空'));
                }else{
                    callback();
                }
            };
            return {
                form: {
                    mname: '',
                    lid:''
                },
                rules2: {
                    mname: [
                        { validator: checkrname, trigger: 'blur' }
                    ]
                },
                checkAll: false,
                checkedCities: [],
                levels:[],
                isIndeterminate: true
            }
        },
        methods:{
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid && this.checkedCities.length) {
                        var query = 'rid='+this.form.rid+'&mname='+this.form.mname+'&lid='+this.checkedCities;
                        fetch('/app/editRole?'+query).then(e=>{
                            return e.text();
                        }).then(res=>{
                            if(res=='ok'){
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
                            this.form.mname = '';
                            this.form.lid = '';
                        })
                    }else if(this.checkedCities.length==0){
                        alert('至少一种权限！！');
                    }
                })
            },
            handleCheckAllChange(val) {
                if (val){
                    this.levels.forEach(ele=>{
                        this.checkedCities.push(ele.lnum);
                    });
                }else{
                    this.checkedCities = [];
                }
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.levels.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.levels.length;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.checkedCities = [];
            }
        },
        mounted(){
            this.form = this.$store.state.roleInfo;
            this.levels = JSON.parse(this.$store.state.levels);
            var arr = this.$store.state.roleInfo.lid.split('、');
            arr.forEach(ele=>{
                this.levels.forEach((value,index)=>{
                    if(ele == value.lname){
                        this.checkedCities.push(index+1);
                    }
                })
            });
        }
    }
</script>
<style>
   @import "../../assets/css/container.css";
    .check{
        padding:0 12px;
        margin-bottom: 20px;
    }
</style>