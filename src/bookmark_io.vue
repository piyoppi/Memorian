<style>
    .btn_save{
        background-image: url('../img/Floppy.png');
        width: 20px;
        height: 20px;
        margin: 0;
    }
    .btn_load{
        background-image: url('../img/folder.png');
        width: 20px;
        height: 20px;
        margin: 0;
    }
    .need-save{
        background-color: orange;
    }
</style>

<template>
    <div>
        <button  v-bind:class="{ need-save: dataChanged }" class="btn_save" v-on:click="save"></button><button class="btn_load" v-on:click="load"></button>
    </div>
</template>

<script>
import getBmark from './get_bmark_controller.js'
import BookmarkIO from './bookmark_io.js'

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if( namespace !== "local") return;
    if( changes.version ){ this.dataChanged = true; }
});

export default {
    data: function () {
        return {
            dataChanged: false,
        }
    },
    created: function(){
        document.addEventListener('keydown', this.keyCheck);
    },
    methods: {
        save: function(){
            getBmark.getTagsAll( tagData => {
                getBmark.getBookmarksAll( bmarkData => {
                    BookmarkIO.save({tag: tagData, bookmark: bmarkData});
                });
            });
        },
        load: function(){
            try{
                BookmarkIO.load().then( data => {
                    getBmark.insertBookmarks(data, e=>{});
                });
            }
            catch(e){
                alert("ÉtÉ@ÉCÉãÇÃì«Ç›çûÇ›Ç…é∏îsÇµÇ‹ÇµÇΩ");
            }
        },
        keyCheck: function(e){
            switch(e.keyCode){
                case 83:
                if( e.ctrlKey ){
                    this.save();
                    e.preventDefault();
                }
                break;
                case 76:
                if( e.ctrlKey ){
                    this.load();
                    e.preventDefault();
                }
                break;

            }
        }
    }
}
</script>
