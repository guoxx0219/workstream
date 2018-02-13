<template>
    <div class="phone">
        <Header captical="联系人" :showLeft="true" :showRight="false"></Header>
        <div class="phoneBox">
            <div class="phoneInfo">
                <ul class="mui-table-view" v-for="letter in nameColl">
                    <li class="mui-table-view-cell lineH" :ref="letter">{{letter}}</li>
                    <ul class="mui-table-view">
                        <li class="mui-table-view-cell" v-for="item in person[letter]">
                            <a :href="'tel:'+item.phone">{{item.uname}}</a>
                            <!--<router-link tag="a" :to="'tel:'+item.phone">{{item.uname}}</router-link>-->
                        </li>
                    </ul>
                </ul>
            </div>
            <div class="phone_slide">
                <ul class="slideUl">
                    <li class="slideLi" v-for="item in nameColl" @click="move(item)">{{item}}</li>
                </ul>
            </div>
        </div>
        <Nav></Nav>
    </div>
</template>
<script>
    import Header from '@/components/header.vue'
    import Nav from '@/components/nav.vue'
    export default {
        name:'phone',
        components:{Header,Nav},
        data(){
            return{
                person:[],
                nameColl :[]
            }
        },
        methods:{
            dealPer(arr){
                //存放字母
                var letter= [];
                arr.forEach(ele=>{
                    var zimu = pinyinUtil.getFirstLetter(ele.uname).slice(0,1).toUpperCase();
                    if(!letter.includes(zimu)){
                        var children = [];
                        letter.push(zimu);
                        children.push(ele);
                        this.person[zimu] = children;
                    }else{
                        var keys = Object.keys(this.person);
                        keys.forEach((val)=>{
                            if(val == zimu){
                                this.person[val].push(ele)
                            }
                        })
                    }
                })
                //letter排序;
                //charCodeAt是字符串的方法，进行字母ASCII的比较
                var str = letter.join("");
                for(var i=0;i<str.length;i++){
                    for (var j=i+1;j<str.length;j++){
                        if(str[i].charCodeAt() > str[j].charCodeAt()){
                            var temp = letter[i];
                            letter[i] = letter[j];
                            letter[j] = temp;
                            //初始化str，否则str仍会按照原来的顺序进行排
                            str = letter.join("");
                        }
                    }
                }
                this.nameColl = letter;
                return this.person;
            },
            move(letter){
                //letter为右面点击时的字母
                //获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left等属性。
                var height = this.$refs[letter][0].getBoundingClientRect().top;
                for (let i in this.$refs){
                    if(this.$refs[i][0].getAttribute("class").includes("active")){
                         this.$refs[i][0].classList.remove("active");
                    }
                }
                this.$refs[letter][0].classList.add('active');
                var phone_slide = document.querySelectorAll(".phone_slide li");
                phone_slide.forEach(ele=>{
                    ele.classList.remove("active");
                    if(ele.innerText == letter){
                        ele.classList.add("active");
                    }
                })
//                盒子内的容器滚动，需给盒子设置scrollTop，在css中盒子设置overflow:scroll才可以让容器进行滚动
                document.querySelector(".phoneBox").scrollTop = height - 44;
            }
        },
        mounted(){
            fetch("/app/showPer").then(e=>{
                return e.json();
            }).then(res=>{
                res.forEach(ele=>{
                    this.nameColl.push(ele.uname);
                })
                this.person = this.dealPer(res);
            })
        }
    }
</script>
<style>
    .phoneBox{
        width: 100%;
        margin-top: 44px;
        height: 574px!important;
        overflow: scroll;
        position: relative;
    }
    .phoneInfo{
        position: relative;
    }
    .phone_slide{
        width: 20px;
        position: fixed;
        top: 44px;
        right: 0;
        font-size: 14px;
        line-height: 1;
    }
    ul{
        position: relative;
        width: 100%;
        list-style:none;
        padding-left: 0!important;
    }
    .mui-table-view{
        text-align: left;
    }
    li{
        color: #848383;
    }
    li.active{
        color: #007aff!important;
    }
    .lineH{
        padding: 4px 15px;
        font-size: 18px;
        background: #e3e3e370;
    }
    .slideLi{
        padding: 4px 0;
        font-size: 15px;
    }
    .slideUl{
        padding:8px 0;
    }
</style>