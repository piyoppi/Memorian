<style>
    #bmarklist{
        width: 400px;
        padding-bottom: 25px;
    }
    .btn_save{
        background-image: url('../img/Floppy.png');
        width: 20px;
        height: 20px;
    }
    .btn_load{
        background-image: url('../img/folder.png');
        width: 20px;
        height: 20px;
    }
    .tab_open{
        background-image: url('../img/newwindow.png');
        width: 20px;
        height: 20px;
    }
    .info{
        background-image: url('../img/hatena.png');
        width: 20px;
        height: 20px;
    }
    .tools{
        position: fixed;
        bottom: 0;
    }
    .bmark-io{
        display: inline-block;
    }
</style>

<template>
    <div>
        <bookmark-list-component id="bmarklist" @updatedBookmark="updatedBookmark"></bookmark-list-component>
        <div class="tools">
            <button class="info" v-on:click="showInformation"></button>
            <button class="tab_open" v-on:click="showBookmarks"></button>
            <bookmark-iobutton-component class="bmark-io"></bookmark-iobutton-component>
        </div>
    </div>
</template>

<script>
import BookmarkListComponent from './bookmark_list.vue'
import BookmarkIobuttonComponent from './bookmark_io.vue'
export default {
    data: function () {
      return {
      }
    },
    components: {
        BookmarkListComponent,
        BookmarkIobuttonComponent 
    },
    created: function(){
        document.addEventListener('keydown', this.keyCheck);
    },
    methods: {
        showBookmarks: function(){
            chrome.runtime.sendMessage({id: "showBookmarks"}, e=>{}); 
        },
        showInformation: function(){
            chrome.runtime.sendMessage({id: "showInformation"}, e=>{}); 
        },
        keyCheck: function(e){
            switch(e.keyCode){
                case 77:
                if( e.ctrlKey ) this.showBookmarks();
                break;
            }
        },
        updatedBookmark: function(e){
            chrome.runtime.sendMessage({id: "sendUpdatedToBookmarkPage"}, e=>{});
        },
    }
}
</script>
