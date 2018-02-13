<template>
   <div class="slide" :style="{height:mheight}">
       <div class="slide-container" ref="container" @touchstart = "start($event)">
            <slot></slot>
       </div>
   </div>
</template>
<script>
    export default {
        name:"slide",
        props:['height'],
        data(){
            return{
                num:0,
                mheight: this.height + 'px',
                container: null,
                startX: 0,
                moveX: 0,
                length:0,
                currentNum: 0,
                //记录当前容器的位置，他所有的值都是100%的倍数，固定值
                current:0
            }
        },
        methods:{
            start(e){
                this.current = parseInt(getComputedStyle(this.container,null).marginLeft);
                this.startX = e.touches[0].pageX;
                this.container.addEventListener('touchmove',this.move);
                this.container.addEventListener('touchend',this.end);
            },
            move(e){
                //手指在滑动时轮播容器的偏移
                this.moveX = e.touches[0].pageX;
                //下次移动时容器所在的位置
                this.container.style.marginLeft = parseInt(this.current + this.moveX - this.startX) + 'px';
            },
            end(e){
                //轮播的结果由this.currentNum所在的图片位置相关，其值是0，-1，-2
                this.container.removeEventListener('touchmove',this.move);
                this.container.removeEventListener('touchend',this.end);
                //出现滑动现象 -- 开始位置!=移动后的位置
                if(Math.abs(this.startX - this.moveX)){
                    // 滑屏的最小宽度
                    this.length = this.moveX - this.startX;
                    this.container.style.transition = 'all 1s ease';
                    //向右滑动
                    if(this.length > 0){
                        //滑动的距离小于120时，不滑屏
                        if (this.length > 120){
                            this.currentNum++;
                            if(this.currentNum > 0){
                                this.currentNum = 0;
                            }
                        }
                    }else{
                        //向左滑动
                        if (this.length < -120){
                            this.currentNum--;
                            if(this.currentNum < -2){
                                this.currentNum = -2;
                            }
                        }
                    }
                    this.container.style.marginLeft = this.currentNum * 100 +'%';
                }
            }
        },
        mounted(){
            //轮播个数
            this.num = document.querySelectorAll('.slide-container>a').length;

            //容器宽度 = 轮播个数 * 屏幕宽度100%
            //this.$refs.container获取的是对应的DOM元素
            this.container = this.$refs.container;
            this.container.style.width = this.num * 100 + '%';

            //每一张轮播图的宽度
            var one = document.querySelectorAll('.slide-container>a');
            one.forEach(ele=>{
                ele.style.width = 100 / this.num + '%';
            });
        }
    }
</script>
<style>
    .slide{
        width: 100%;
        height: 200px;
        padding-top: 44px;
        position: relative;
        overflow: hidden;
    }
    .slide-container{
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .one{
        display: inline-block;
        height: 100%;
    }
</style>