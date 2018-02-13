<template>
    <div>
        <router-view></router-view>
        <nav class="mui-bar mui-bar-tab">
            <router-link tag="a" class="mui-tab-item" to="/kind/send" exact>
                <span class="mui-icon mui-icon-paperplane"></span>
                <span class="mui-tab-label">已发送</span>
            </router-link>
            <router-link tag="a" class="mui-tab-item" to="/kind/accept">
                <span class="mui-icon mui-icon-email"></span>
                <span class="mui-tab-label">已接收</span>
            </router-link>
        </nav>
    </div>
</template>
<script>
    export default {
        name:'accept',
        data(){
            return{

            }
        }
    }
</script>