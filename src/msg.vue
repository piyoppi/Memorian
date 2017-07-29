<style scoped>
.msg_outer{
    width: 450px;
    position: fixed;
    bottom: 2px;
    right: 0px;
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
.insert-enter, .insert-leave-to{ right: -500px; }
.insert-enter-active, .insert-leave-active{
    transition: right 300ms cubic-bezier(0.420, 0.000, 0.580, 1.000);
}
</style>


<template>
    <transition name="insert">
        <div class="msg_outer" v-if="isShow">
            コピーが完了しました
            <pre><code v-highlight="content"></code></pre>
        </div>
    </transition>
</template>

<script>
import hljs from 'highlight.js'
import styles from 'highlight.js/styles/hybrid.css'

export default {
    data: function(){
        return{
            isShow: false,
            content: ""
        }
    },
    created: function(){
    },
    methods: {
        show: function(content, timeout){ 
            this.isShow = true;
            this.content = content || "";
            if( timeout ) setTimeout( ()=>{ this.hide(); }, timeout );
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
