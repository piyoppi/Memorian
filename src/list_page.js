import Vue from 'vue'


var appOptions = require('./bg_app.vue');
window.addEventListener("load", function(){
    var app = new Vue(appOptions).$mount('#app');
}, false);

