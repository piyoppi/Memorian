

<style>
ul{
    width: 400px;
}
.htag_list{
    list-style: none;
}
.htag_list li{
    display: inline-block; 
}
</style>

<template>
    <ul>
        <li v-for="(item, index) in bookmark_list">
            <a :href="item.url">{{ item.title }}</a>
            <ul class="htag_list">
                <li v-for="htag in item.header_tags">{{ htag }}</li>
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
                if(header_tag) val.header_tags = header_tag.split(",");
            });
            console.log(this.bookmark_list);
        }); 
    },
    methods: {
        delete_item: function(item, index){
            console.log(item);
            bmark.delete_item(item.key);
            this.bookmark_list.splice(index, 1);
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
