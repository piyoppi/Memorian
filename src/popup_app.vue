

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
    overflow: hidden;
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
    overflow: hidden;
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
        <transition-group tag="ul" id="snippet_list" v-on:leave="leave_bmark" >
            <li v-for="(item, index) in bookmarkList" class="bmark_item" v-bind:key="index">
                <a :href="item.url" class="page_title" v-on:click="jump_link(item, '')">{{ item.title }}</a>
                <ul class="htag_list">
                    <li v-for="htag in item.tags">
                        <a :href="item.url" v-on:click="jump_link(item, htag)">{{ htag.text }}</a>
                    </li>
                </ul>
                <transition-group tag="ul" v-on:leave="leave_code" >
                    <li class="code_item" v-for="(content, contentIndex) in item.contents" v-bind:key="content">
                        <pre><code v-highlight="content"></code></pre>
                        <button :data-clipboard-text="content" class="btn_cp" href="#"></button>
                        <button v-on:click="removeCode(item, contentIndex, index)" class="btn_remove" href="#">remove</button>
                    </li>
                </transition-group>
                <a v-on:click="removeItem(item, index)" href="#">削除</a>
            </li>
        </transition-group>
    </div>
</template>

<script>
import GetBmark from './get_bmark_controller.js'
import hljs from 'highlight.js'
import styles from 'highlight.js/styles/hybrid.css'
import clipbrd from 'clipboard'
import Velocity from 'velocity-animate'
new clipbrd('.btn_cp');

let bmark = new GetBmark();
import FindComponent from './findset.vue'

let getDataAmount = 5;

export default {
    components: {
        FindComponent
    },
    data: function(){
        return{
            bookmarkList: [],
            query: "",
            isStopScroll: false,
        }
    },
    created: function(){
        bmark.get_bookmarks_request(0, getDataAmount, e=>{
            this.bookmarkList = e;
        }); 
        document.addEventListener("scroll", ()=>{
            if( this.isStopScroll ) return;
            if( document.documentElement.clientHeight - window.innerHeight - window.scrollY < 10 ) this.paginate();
        }, false);
    },
    methods: {
        removeItem: function(item, index){
            bmark.removeItem(item.key);
            this.bookmarkList.splice(index, 1);
        },
        jump_link: function(item, tag){
            bmark.jump_link(item, tag);
        },
        find: function(query){
            this.isStopScroll = false;
            this.query = query;
            bmark.find({query: query, offset: 0, length: getDataAmount}, e=>{ this.bookmarkList = e; });
        },
        paginate: function(){
            bmark.find({query: this.query, offset: this.bookmarkList.length, length: getDataAmount}, e=>{
                this.bookmarkList = this.bookmarkList.concat(e);
                if( e.length < getDataAmount ) this.isStopScroll = true;
            });
        },
        removeCode: function(item, contentIndex, index){
            bmark.removeCode(item.key, contentIndex);
            item.contents.splice(contentIndex, 1);
            if( item.contents.length === 0 ){
                this.removeItem(item, index)
            }
        },
        leave_code: function(el, done){
            Velocity(el, {height: "0px"}, {duration: 400}, {complete: done});
        },
        leave_bmark: function(el, done){
            Velocity(el, {height: "0px"}, {duration: 400}, {complete: done});
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
    },
}
</script>
