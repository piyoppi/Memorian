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
</style>

<template>
    <div>
        <button class="btn_save"></button>
        <button class="btn_load"></button>
        <bookmark-list-component id="bmarklist" show_type="page"></bookmark-list-component>
    </div>
</template>

<script>

import BookmarkListComponent from './bookmark_list.vue'
import GetBmark from './get_bmark_controller.js'
import BookmarkIO from './bookmark_io.js'
let bmark = new GetBmark();

export default {
    data: function () {
      return {
      }
    },
    created: function(){
        document.addEventListener('keydown', this.keyCheck);
    },
    components: {
        BookmarkListComponent 
    },
    methods: {
        save: function(){
            bmark.getTagsAll( tagData => {
                bmark.getBookmarksAll( bmarkData => {
                    BookmarkIO.save({tag: tagData, bookmark: bmarkData});
                });
            });
        },
        load: function(){
            try{
                BookmarkIO.load();
            }
            catch(e){
                console.log(e);
            }
        },
        keyCheck: function(e){
            switch(e.keyCode){
                case 83:
                    if( e.ctrlKey ) this.save();
                    e.preventDefault();
                    break;
                case 76:
                    if( e.ctrlKey ) this.load();
                    e.preventDefault();
                    break;

            }
        }
    }
}
</script>
