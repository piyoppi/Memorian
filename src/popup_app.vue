

<style>
ul{
    width: 400px;
}
</style>

<template>
    <ul>
        <li v-for="item in bookmark_list">
            <a :href="item.data.url">{{ item.data.title }}</a>
            <pre>
                <code v-highlight>
                    {{ item.data.block_html }}
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
    data: {
        bookmark_list: []
    },
    created: function(){
        bmark.get_bookmarks_request((e) => {
            this.bookmark_list = e;
        }); 
    },
    methods: {
    },
    directives: {
        highlight: {
            bind: function(el, binding){
                if (binding.value) { el.innerHTML = binding.value; }
                hljs.highlightBlock(el);
                console.log("hogehoge");
            },
            componentUpdated: function(el, binding){
                if (binding.value) { el.innerHTML = binding.value; }
                hljs.highlightBlock(el);
                console.log("fugafuga");
            }
        }
    }
}
</script>
