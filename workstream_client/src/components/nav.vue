<template>
    <nav class="mui-bar mui-bar-tab">
        <router-link tag="a" class="mui-tab-item" to="/" exact>
            <span class="mui-icon mui-icon-home"></span>
            <span class="mui-tab-label">首页</span>
        </router-link>
        <router-link tag="a" class="mui-tab-item" to="/phone">
            <span class="mui-icon mui-icon-phone"></span>
            <span class="mui-tab-label">电话</span>
        </router-link>
        <router-link tag="a" class="mui-tab-item" to="/logs">
            <span class="mui-icon mui-icon-email"></span>
            <span class="mui-tab-label">日志</span>
        </router-link>
        <router-link tag="a" class="mui-tab-item" to="/setting">
            <span class="mui-icon mui-icon-gear"></span>
            <span class="mui-tab-label">设置</span>
        </router-link>
    </nav>
</template>
<script>

</script>
<style>
</style>