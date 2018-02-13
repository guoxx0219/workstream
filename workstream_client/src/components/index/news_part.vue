<template>
    <div class="newsPart">
        <p>{{mes}}</p>
        <div @touchstart="start($event)" ref="newsContainer">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name:'news_part',
        props:['success'],
        data(){
            return{
                mes:'',
                startY:0,
                moveY:0,
                newsContainer:null,
            }
        },
        methods:{
            start(e){
                this.startY = e.touches[0].pageY;
                //此处不可以写为this.move(e),因为不写e时，表示都是用的start的事件对象，写上就表示重新的一个事件对象
                this.newsContainer.addEventListener('touchmove',this.move);
                this.newsContainer.addEventListener('touchend',this.end);
            },
            move(e){
                this.mes = "下拉更新...";
                this.moveY = e.touches[0].pageY;
            },
            end(e){
                this.mes = "正在更新...";
                if(this.moveY - this.startY){
                    if(this.moveY - this.startY > 100){
                        this.newsContainer.style.paddingTop = '44px';
                        if(this.success()){
                            this.success();
                        }
                        this.over();
                    }
                }
                this.newsContainer.removeEventListener('touchmove',this.move)
                this.newsContainer.removeEventListener('touchend',this.end);
            },
            over(){
                setTimeout(()=>{
                    this.mes = '更新完成...';
                    this.newsContainer.style.paddingTop = '0px';
                    this.newsContainer.style.transition = 'all 0.2s';
                },1000)
            },
        },
        mounted(){
            //this.newsContainer为目标DOM元素
            this.newsContainer = this.$refs.newsContainer;
        }
    }
</script>
<style>
    .newsPart{
        width: 100%;
        position: relative;
    }
    .newsPart>p{
        font-size: 18px;
        color: #6d6d72;
        line-height: 44px;
        padding: 0;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin-left:auto;
        margin-right:auto;
    }
</style>