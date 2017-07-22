

<style>
ul{
    width: 400px;
}
.htag_list{
    list-style-type: none;
}
.htag_list li{
    display: inline-block; 
}

.htag_list li:before{
    content: " ";
    width: 10px;
    height: 10px;
    background-position: center;
    background-repeat: none;
    background-image: url("../img/pankuzu.png"); 
    display: inline-block;
    margin-right: 3px;
}

.htag_list li:first-child:before{
    width: 0;
    height: 0;
    background-image: none; 
}

</style>


<template>
    <ul>
        <li v-for="(item, index) in bookmark_list">
            <a :href="item.url" v-on:click="jump_link(item)">{{ item.title }}</a>
            <ul class="htag_list">
                <li v-for="htag in item.tags">
                    <a :href="item.url">{{ htag.text }}</a>
                </li>
            </ul>
            <pre>
                <code v-highlight>
                    {{ item.block }}
                </code>
            </pre>
            <a v-on:click="delete_item(item, index)" href="#">削除</a>
        </li>
    </ul>
</template>

<script>
import GetBmark from './get_bmark_controller.js'
import hljs from 'highlight.js'
import styles from 'highlight.js/styles/dark.css'

let bmark = new GetBmark();

export default {
    data: function(){
        return{
            bookmark_list: []
        }
    },
    created: function(){
        bmark.get_bookmarks_request((e) => {
            this.bookmark_list = e;
            this.bookmark_list.forEach( val => {
                let header_tag = val.header_tag_text
                console.log(val);
                if(header_tag) val.header_tags = header_tag.split("<,>");
            });
        }); 
    },
    methods: {
        delete_item: function(item, index){
            bmark.delete_item(item.key);
            this.bookmark_list.splice(index, 1);
        },
        jump_link: function(item){
            bmark.jump_link(item.url);
        }
    },
    directives: {
        highlight: {
            bind: function(el, binding){
                if (binding.value) { el.innerHTML = binding.value; }
                hljs.highlightBlock(el);
            },
            componentUpdated: function(el, binding){
                if (binding.value) { el.innerHTML = binding.value; }
                hljs.highlightBlock(el);
            }
        },
        htag: {
            bind: function(el, binding){
                if( !binding.value ) return;
                let tags = binding.value.split(",");
                el.innerHTML = "";
                tags.forEach( val=>{ if( val !== "" ){ el.innerHTML += ((el.innerHTML === "") ? "" : " > ") + val;}} );
            },
        }
    }
}
</script>
