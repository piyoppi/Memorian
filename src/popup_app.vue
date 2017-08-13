<style>
    #bmarklist{
        width: 400px;
    }
</style>

<template>
    <bookmark-list-component id="bmarklist"></bookmark-list-component>
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
