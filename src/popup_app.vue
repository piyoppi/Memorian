<style>
ul{
    width: 400px;
}
</style>

<template>
    <ul>
        <li v-for="item in bookmark_list">
            {{ item.title }}
        </li>
    </ul>
</template>

<script>
module.exports = {
    data: {
        bookmark_list: []
    }
}
</script>
