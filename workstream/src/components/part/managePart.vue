<script>
    export default {
        name:'managePart',
        data(){
            return{
                tel:[],
                data2: [],
            }
        },
        render(h){
            if(!this.tel.length){
                this.create();
            }
            var that = this;
            return (<div class="main">
                        <h3 class="capital">部门管理</h3>
                        <div class="table">
                            <table class="el-table__header box-table" >
                                <thead class="has-gutter">
                                <tr>
                                    <th class="el-table_1_column_12 cell is-leaf">ID</th>
                                    <th class="el-table_1_column_12 cell is-leaf">部门名称</th>
                                    <th class="el-table_1_column_12 cell is-leaf">操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                     {that.tel}
                                </tbody>
                            </table>
                        </div>
                    </div>
               );
        },
        methods:{
            create(){
                var that = this;
                var step = 0;
                function createRender(arr,num) {
                    var star = '>'.repeat(step);
                    arr.forEach(ele=>{
                        if(ele.parentid == 0){
                            step = 0;
                        }
                        that.tel.push(<tr><td class="center">{ele.pid}</td><td class="padding">{star}{ele.label}</td><td  class="center"><span onClick={()=>{return that.edit(ele)}}>编辑</span><span onClick={()=>{return that.del(ele)}}>删除</span></td></tr>);
                        if(ele.children.length){
                            step++;
                            createRender(ele.children,ele.pid);
                        }
                    })
                }
                createRender(this.data2,0);
                return this.tel;
            },
            edit(data){
                this.$router.push('editPart');
                this.$store.commit("part",data);
            },
            del(data){
                var that = this;
                if (data.children.length){
                    that.$message({
                        type: 'warning',
                        message: '不能删除!'
                    });
                    return;
                }
                that.$confirm('此操作会影响其它数据, 是否继续?', '提示', {
                   confirmButtonText: '确定',
                   cancelButtonText: '取消',
                   type: 'warning'
                }).then(() => {
                   var id = data.pid;
                   var aid = that.$store.state.aid;
                   fetch("/app/delPart?id="+id+'&aid='+aid).then(res=>{
                       return res.text();
                   }).then(res=>{
                       if(res == 'ok'){
                           that.tel = that.tel.filter(ele=>{
                               return ele.elm.firstElementChild.innerHTML != id;
                           });
                           that.$message({
                               type: 'success',
                               message: '删除成功!'
                           });
                       }else{
                           that.$message({
                               type: 'info',
                               message: res
                           });
                       }
                   })
               }).catch(() => {
                   that.$message({
                       type: 'info',
                       message: '已取消删除'
                   });
               });
            },
            //将数据库返回的数据进行整理,res为数据库返回的未处理的数据，arr为处理数据后存放的地方，pid为起始遍历的id值
            tree(res,arr,pid) {
                res.forEach(ele=>{
                    if(ele.parentid == pid){
                        var obj = {};
                        obj.label = ele.pname;
                        obj.pid = ele.pid;
                        obj.parentid = ele.parentid;
                        obj.children = [];
                        arr.push(obj);
                        this.tree(res,obj.children,ele.pid);
                    }
                })
                return arr;
            }
        },
        mounted(){
            fetch("/app/selectPart").then(res=>{
                return res.json();
            }).then(res=>{
                var arr = [];
                this.tree(res,arr,0);
                this.data2 = arr;
                this.$store.commit("allPart",this.data2);
            })
        }
    }
</script>
<style>
    @import "../../assets/css/container.css";
    .table{
        width: 100%;
        height: 500px;
        padding: 0 20px;
    }
    .box-table{
        width: 100%;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        border-collapse: collapse;
    }
    th,td{
        padding:0 12px 0 0;
        border:1px solid #ebeef5;
    }
    .center{
        text-align: center;
    }
    .padding{
        padding-left: 16px;
    }
    span{
        padding: 0 6px;
        cursor: pointer;
    }
    .table{
        overflow: scroll;
    }
</style>