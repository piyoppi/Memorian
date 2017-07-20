

<style>
ul{
    width: 400px;
}
</style>

<template>
    <ul>
        <li v-for="item in bookmark_list">
            <a :href="item.data.url">{{ item.data.title }}</a>
            <ul>
                <li v-for="htag in item.data.header_tags">{{ htag }}</li>
            </ul>
            <pre>
                <code v-highlight>
                    {{ item.data.block }}
                </code>
            </pre>
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
                let header_tag = val.data.header_tag_text
                console.log( val);
                if(header_tag) val.data.header_tags = header_tag.split(",");
            });
            console.log(this.bookmark_list);
        }); 
    },
    methods: {

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
