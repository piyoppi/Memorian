import Vue from 'vue'

var appOptions = require('./popup_app.vue');
window.addEventListener("load", function(){
    var app = new Vue(appOptions).$mount('#app');

}, false);

