<style scoped>

</style>

<template>
    <a :href="item.url" class="page_title" v-on:click="jump_link(item, '')">{{ item.title }}</a>
    <button class="btn_removebmark" v-on:click="removeItem(item, index)" href="#"></button>
    <ul class="htag_list">
        <li v-for="htag in item.tags">
            <a :href="item.url" v-on:click="jump_link(item, htag)">{{ htag.text }}</a>
        </li>
    </ul>
    <transition-group tag="ul" v-on:leave="leave_code" >
        <li class="code_item" v-for="(content, contentIndex) in item.contents" v-bind:key="content">
            <pre><code v-highlight="content"></code></pre>
            <button :data-clipboard-text="content" class="btn_cp" href="#"></button>
            <button v-on:click="removeCode(item, contentIndex, index)" class="btn_removecode" href="#"></button>
        </li>
    </transition-group>
    <!--
        <button v-on:click="addTag(item)" class="" href="#">tag</button>
        <input type="text" v-model="taginput" ></input>
    -->
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
            taginput: "",
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
            console.log(item.contents);
            if( item.contents.length === 0 ){
                this.removeItem(item, index)
            }
        },
        leave_code: function(el, done){
            Velocity(el, {height: "0px"}, {duration: 400}, {complete: done});
        },
        leave_bmark: function(el, done){
            Velocity(el, {height: "0px", opacity: 0}, {duration: 400, display: "none"}, {complete: done});
        },
        addTag: function(item){

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
