<style scoped>
.msg_outer{
    width: 450px;
    position: fixed;
    bottom: 2px;
    right: 0;
    border: solid 1px gray;
    text-align: center;
    vertical-align: middle;
    display: table-cell;
    z-index: 10000;
    padding: 10px;
    background-color: white;
}
pre{
    text-align: left;
    font-size: 9pt;
    background-color: transparent;
    border-style: none;
}
</style>


<template>
    <div class="msg_outer" v-show="isShow">
        コピーが完了しました
        <pre><code v-highlight="content"></code></pre>
    </div>
</template>

<script>
import hljs from 'highlight.js'
import styles from 'highlight.js/styles/hybrid.css'

export default {
    data: function(){
        return{
            isShow: true,
            content: ""
        }
    },
    created: function(){
    },
    methods: {
        show: function(content){ 
            this.isShow = true;
            this.content = content || "";
        },
        hide: function(){
            this.isShow = false;
        }
    },
    directives: {
        highlight: function(el, binding){
            if (binding.value) { el.className=""; el.innerText = binding.value; }
            hljs.highlightBlock(el);
        },
    }
}
</script>
