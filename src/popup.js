import Vue from 'vue'

var appOptions = require('./popup_app.vue');
window.addEventListener("load", function(){
    var app = new Vue(appOptions).$mount('#app');
}, false);

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if( request.id = "element_memo" ){

            }
        });
