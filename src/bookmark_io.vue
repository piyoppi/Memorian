<style>
    .btn_save{
        background-image: url('../img/fp2.png');
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
    .needsave{
        background-color: orange;
    }
</style>

<template>
    <div>
        <button  v-bind:class="{ needsave: currentVersion != savedVersion }" class="btn_save" v-on:click="save"></button><button class="btn_load" v-on:click="load"></button>
    </div>
</template>

<script>
import getBmark from './get_bmark_controller.js'
import BookmarkIO from './bookmark_io.js'

export default {
    data: function () {
        return {
            savedVersion: 0,
            currentVersion: 0,
        }
    },
    created: function(){
        document.addEventListener('keydown', this.keyCheck);

        chrome.storage.onChanged.addListener((changes, namespace) => {
            if( namespace !== "local") return;
            if( changes.version ) this.currentVersion = changes.version;
        });
        
        try{
            chrome.storage.local.get( ['savedVersion', 'version'], (param) => {
                if( param ){
                    this.currentVersion = param.version || 0;
                    this.savedVersion = param.savedVersion || 0;
                } 
            });
        }
        catch(e){
            this.currentVersion = 0;
            this.savedVersion = 0;
        }

    },
    methods: {
        save: function(){
            getBmark.getTagsAll( tagData => {
                getBmark.getBookmarksAll( bmarkData => {
                    BookmarkIO.save({tag: tagData, bookmark: bmarkData});
                });
            });
            chrome.storage.local.set({'savedVersion': this.currentVersion}, ()=>{});
            this.savedVersion = this.currentVersion;
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
