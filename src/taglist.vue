<template>
    <ul class="taglist">
        <li v-for="(tag, index) in tags" v-on:click.self="tagClick(tag, index)">
            {{ tag.tagName }}
            <button class="remove_tag" v-show="item" v-on:click="detachTag(tag, index)">x</button>
        </li>
    </ul>
</template>

<script>
import GetBmark from './get_bmark_controller.js'
let bmark = new GetBmark();

export default {
    components: {
    },
    data: function(){
        return{
        }
    },
    props: [
        "item",
        "tags",
    ],
    created: function(){
    },
    methods: {
        detachTag: function(tag, index){
            bmark.detachTag(this.item.id, tag.id);
            this.item.tags.splice(index, 1);
        },
        tagClick: function(tag, index){
            this.$emit('tagClick', tag);
        }
    },
    directives: {
    },
}
</script>

<style scoped>

.taglist{
    list-style-type: none;
    padding-left: 0;
}

.taglist li{
    display: block;
    float: left;
    border-radius: 3px;
    border-style: solid;
    border-width: 1px;
    margin: 2px;
    padding: 1px 6px;
    color: gray;
    cursor: pointer;
    border-color: gainsboro;
    transition: all 300ms cubic-bezier(0.250, 0.250, 0.750, 0.750); /* linear */
    height: 20px;
}

.remove_tag{
    width: 15px;
    height: 15px;
    font-size: 8pt;
    text-align: center;
    border-radius: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: gainsboro;
    margin-left: 10px;
    color: gainsboro;
    background-color: white;
    cursor: pointer;
    transition: all 300ms cubic-bezier(0.250, 0.250, 0.750, 0.750); /* linear */
}
.remove_tag:hover{
    background-color: gainsboro;
    color: white;
}

.taglist:after{
    clear: both;
    display: block;
    content: " ";
}
.taglist li:hover{
    border-color: black;
}
</style>
