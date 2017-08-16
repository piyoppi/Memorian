<style>
    #bmarklist{
        width: 400px;
    }
</style>

<template>
    <div>
        <bookmark-list-component id="bmarklist"></bookmark-list-component>
    </div>
</template>

<script>
import BookmarkListComponent from './bookmark_list.vue'
export default {
    data: function () {
      return {
      }
    },
    components: {
        BookmarkListComponent 
    },
    created: function(){
        document.addEventListener('keydown', this.keyCheck);
    },
    methods: {
        keyCheck: function(e){
            switch(e.keyCode){
                case 77:
                    if( e.ctrlKey ) chrome.runtime.sendMessage({id: "showBookmarks"}, (e)=>{}); 
                    break;
            }
        },
    }
}
</script>
