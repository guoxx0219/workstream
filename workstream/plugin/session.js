//声明插件
var obj = {
    //v表示vue的实例，params是设置选项，表示在调用这个插件时，可以传一个对象
    install(v,params){
        v.prototype.getSession = function(attr){
            return sessionStorage.getItem[attr];
        },
        v.prototype.setSession = function(attr,val){
            sessionStorage.setItem[attr] = val;
        }
    }
}