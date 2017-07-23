

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

input[type="text"]{
    width: calc( 100% - 50px );
    padding: 3px;
}

</style>


<template>
    <div>
        <input type="text" v-model="query"  v-on:keyup.enter="find()" v-textarea="bookmark_list.length !== 0">
        <input type="button" value="Find" v-on:click="find()">
        <ul>
            <li v-for="(item, index) in bookmark_list" class="bmark_item">
                <a :href="item.url" class="page_title" v-on:click="jump_link(item, '')">{{ item.title }}</a>
                <ul class="htag_list">
                    <li v-for="htag in item.tags">
                        <a :href="item.url" v-on:click="jump_link(item, htag)">{{ htag.text }}</a>
                    </li>
                </ul>
                <pre><code v-highlight="item.block"></code></pre>
                <a v-on:click="delete_item(item, index)" href="#">削除</a>
            </li>
        </ul>
    </div>
</template>

<script>
import GetBmark from './get_bmark_controller.js'
import hljs from 'highlight.js'
import styles from 'highlight.js/styles/hybrid.css'

let bmark = new GetBmark();

export default {
    data: function(){
        return{
            bookmark_list: [],
            query: ""
        }
    },
    created: function(){
        bmark.get_bookmarks_request(e=>{
            this.bookmark_list = e;
        }); 
    },
    methods: {
        delete_item: function(item, index){
            bmark.delete_item(item.key);
            this.bookmark_list.splice(index, 1);
        },
        jump_link: function(item, tag){
            bmark.jump_link(item, tag);
        },
        find: function(){
            bmark.find(this.query, e=>{ console.log("#"); console.log(e); this.bookmark_list = e; });
        }
    },
    directives: {
        textarea: function(el, binding){ el.focus(); },
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
