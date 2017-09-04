<style>
    code{
        font-size: 11pt;
    }
    #bmarklist{
        width: 700px;
        margin: 0 auto;
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
    .info{
        background-image: url('../img/hatena.png');
        width: 20px;
        height: 20px;
    }
</style>

<template>
    <div>
        <bookmark-iobutton-component></bookmark-iobutton-component>
        <button class="info" v-on:click="showInformation"></button>
        <bookmark-list-component id="bmarklist" @linkClick="linkClick" show_type="page"></bookmark-list-component>
    </div>
</template>

<script>

import BookmarkIobuttonComponent from './bookmark_io.vue'
import BookmarkListComponent from './bookmark_list.vue'
import getBmark from './get_bmark_controller.js'
import jLink from './jump_link.js'
var jumpLink = new jLink();

export default {
    data: function () {
      return {
      }
    },
    created: function(){
        document.addEventListener('keydown', this.keyCheck);

        chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
            if( !request.key ) return;
            switch( request.key ){
                case "getUpdatedByBookmarkPopup":
                case "getAddBookmark":
                    location.reload();
                    break;
            }
        });
    },
    components: {
        BookmarkListComponent,
        BookmarkIobuttonComponent 
    },
    methods: {
        linkClick: function(item, tag){
            jumpLink.Jump(item, tag);
        },
        showInformation: function(){
            chrome.runtime.sendMessage({id: "showInformation"}, e=>{}); 
        },
    }
}
</script>
