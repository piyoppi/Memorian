<style>
    code{
        font-size: 11pt;
    }
    #bmarklist{
        width: 700px;
        margin: 0 auto;
    }
</style>

<template>
    <bookmark-list-component id="bmarklist" show_type="page"></bookmark-list-component>
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
    }
  }
</script>
