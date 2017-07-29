

<style scoped>
ul{
    width: 400px;
    list-style-type: none;
    margin: 0;
    padding: 10px;
}
.bmark_item{
    padding: 0 0 10px 0;
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: gainsboro;
}
.bmark_item:last-child{
    border-style: none;
}

.page_title{
    text-decoration: none;
    display: block;
    margin: 8px 3px;
    color: black;
    font-weight: bold;
    font-size: 10pt;
}
.htag_list{
    margin: 3px;
    padding: 0;
    list-style-type: none;
}
.htag_list li{
    display: inline-block; 
}

.htag_list li>a{
    color: gray;
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


.btn_cp{
    width: 20px;
    height: 20px;
    background-color: transparent;
    border-style: none;
    background-image: url('../img/memopad.png');
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    top: 5px;
    right: 5px;
    opacity: 0.7;
}
.btn_cp:hover{
    background-color: gainsboro;
}
.btn_cp:active{
    background-color: gray;
}

.code_item{
    position: relative;
}

#header{
    position: fixed;
    top: 0;
    width: 100%;
    background-color: white;
    z-index: 2;
}

#outer{
    margin-top: 30px;
}

</style>


<template>
    <div id="outer">
        <div id="header">
            <find-component @find="find"></find-component>
        </div>
        <ul id="snippet_list">
            <li v-for="(item, index) in bookmark_list" class="bmark_item">
                <a :href="item.url" class="page_title" v-on:click="jump_link(item, '')">{{ item.title }}</a>
                <ul class="htag_list">
                    <li v-for="htag in item.tags">
                        <a :href="item.url" v-on:click="jump_link(item, htag)">{{ htag.text }}</a>
                    </li>
                </ul>
                <ul>
                    <li class="code_item" v-for="content in item.contents">
                        <pre><code v-highlight="content"></code></pre>
                        <button :data-clipboard-text="content" class="btn_cp" href="#"></button>
                    </li>
                </ul>
                <a v-on:click="delete_item(item, index)" href="#">削除</a>
            </li>
        </ul>
    </div>
</template>

<script>
import GetBmark from './get_bmark_controller.js'
import hljs from 'highlight.js'
import styles from 'highlight.js/styles/hybrid.css'
import clipbrd from 'clipboard'
new clipbrd('.btn_cp');

let bmark = new GetBmark();
import FindComponent from './findset.vue'


export default {
    components: {
        FindComponent
    },
    data: function(){
        return{
            bookmark_list: [],
            query: ""
        }
    },
    created: function(){
        bmark.get_bookmarks_request(0, 3, e=>{
            this.bookmark_list = e;
        }); 
        document.addEventListener("scroll", ()=>{
            if( document.height - window.scrollY < 10 ) this.paginate();
        }, false);
    },
    methods: {
        delete_item: function(item, index){
            bmark.delete_item(item.key);
            this.bookmark_list.splice(index, 1);
        },
        jump_link: function(item, tag){
            bmark.jump_link(item, tag);
        },
        find: function(query){
            this.query = query;
            bmark.find({query: query, start: 0, length: 3}, e=>{ this.bookmark_list = e; });
        },
        paginate: function(){
            bmark.find({query: this.query, start: this.bookmark_list.length, length: 3}, e=>{ this.bookmark_list = e; });
        }
    },
    directives: {
        highlight: function(el, binding){
            if (binding.value) { el.className=""; el.innerText = binding.value; }
            hljs.highlightBlock(el);
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
