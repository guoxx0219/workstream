<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'app',
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  a{
    text-decoration: none;
  }
  #app,body,html{
    width: 100%;
    height: 100%;
    color: #ffffff;
  }
  #app,body{
    overflow: hidden;
  }
  #app{
    background:url("assets/img/timg.jpg")no-repeat center/cover;
    opacity: 0.9;
  }
</style>
