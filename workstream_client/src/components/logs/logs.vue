<template>
    <div>
        <div class="logs">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    export default {
        name:'logs',
        data(){
            return{
            }
        },
    }
</script>
<style>
    .logs{
        padding-top: 44px;
    }
</style>