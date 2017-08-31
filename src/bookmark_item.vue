<template>
    <div class="outer" v-focus="selected" tabIndex="0">
        <a :href="item.url" class="page_title" v-on:click="jump_link(item, '')">{{ item.title }}</a>
        <button class="btn_removebmark" v-on:click="removeItem(item, index)" href="#"></button>
        <ul class="htag_list">
            <li v-for="htag in item.captions">
                <a href="#" v-on:click.prevent="jump_link(item, htag)">{{ htag.text }}</a>
            </li>
        </ul>
        <transition-group tag="ul" class="code_list" v-on:leave="leave_code" >
            <li class="code_item" v-for="(content, contentIndex) in item.contents" v-bind:key="content">
                <pre><code v-highlight="content"></code></pre>
                <button :data-clipboard-text="content" class="btn_cp" href="#"></button>
                <button v-on:click="removeCode(item, contentIndex, index)" class="btn_removecode" href="#"></button>
            </li>
        </transition-group>
    </div>
</template>


<script>
import getBmark from './get_bmark_controller.js'
import hljs from 'highlight.js'
import styles from 'highlight.js/styles/hybrid.css'
import clipbrd from 'clipboard'
import Velocity from 'velocity-animate'
new clipbrd('.btn_cp');


export default {
    components: {
    },
    data: function(){
        return{
        }
    },
    props: [
        "item",
        "index",
        "selected"
    ],
    created: function(){
    },
    watch: {
        selected: function(val){
            if( val ){document.addEventListener('keydown', this.keyCheck);}
            else{document.removeEventListener('keydown', this.keyCheck);}
        }
    },
    methods: {
        jump_link: function(item, tag){
            getBmark.jump_link(item, tag);
            this.$emit('linkClick', item, tag);
        },
        removeCode: function(item, contentIndex, index){
            getBmark.removeCode(item.id, contentIndex, ()=>{
                this.$emit('updatedBookmark');
            });
            item.contents.splice(contentIndex, 1);
            if( item.contents.length === 0 ){
                this.removeItem(item, index)
            }
        },
        removeItem: function(item, index){
            getBmark.removeItem(item.id, ()=>{
                this.$emit('removed_bookmark', item, index);
                this.$emit('updatedBookmark');
            });
        },
        leave_code: function(el, done){
            Velocity(el, {height: "0px"}, {duration: 400}, {complete: done});
        },
        detachTag: function(tag, index){
            getBmark.detachTag(this.item.id, tag.id, ()=>{
                this.$emit('updatedBookmark');
            });
            this.item.tags.splice(index, 1);
        },
        keyCheck: function(e){
            switch(e){
                case 67:
                    break;
            }
        },
    },
    directives: {
        highlight: function(el, binding){
            if (binding.value) { el.className=""; el.innerText = binding.value; }
            hljs.highlightBlock(el);
        },
        htag: {
            bind: function(el, binding){
                if( !binding.value ) return;
                let captions = binding.value.split(",");
                el.innerHTML = "";
                captions.forEach( val=>{ if( val !== "" ){ el.innerHTML += ((el.innerHTML === "") ? "" : " > ") + val;}} );
            },
        },
        focus: {
            componentUpdated: function(el, binding){
                if( binding.value ){ el.focus(); }
            },
        },
    },
}
</script>

<style scoped>
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
.btn_cp, .btn_removecode, .btn_removebmark{
    width: 20px;
    height: 20px;
    background-color: transparent;
    border-style: none;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    opacity: 0.7;
}
.btn_cp{
    top: 7px;
    right: 10px;
    background-image: url('../img/memopad.png');
}
.btn_removecode{
    top: 7px;
    right: 30px;
    background-image: url('../img/gomi.png');
}
.btn_removebmark{
    top: 5px;
    right: 5px;
    background-image: url('../img/gomi_kuro.png');
}
.btn_cp:hover, .btn_removecode:hover, .btn_removebmark:hover{
    background-color: gainsboro;
}
.btn_cp:active, .btn_removecode:active, .btn_removebmark:active{
    background-color: gray;
}

.code_list{
    margin-left: 0;
    padding-left: 0;
    margin-top: 2px;
    padding-top: 0;
}

.code_item{
    position: relative;
    overflow: hidden;
    margin: 1px;
    padding: 1px;
    display: block;
}

.code_item pre{
    margin: 1px;
}

.code_item code{
    padding: 10px;
}

.taglist{
    list-style-type: none;
    padding-left: 0;
}

.taglist li{
    display: block;
    float: left;
    border-radius: 3px;
    border-style: solid;
    border-width: 1px;
    margin: 2px;
    padding: 1px 6px;
    color: gray;
    cursor: pointer;
    border-color: gainsboro;
    transition: all 300ms cubic-bezier(0.250, 0.250, 0.750, 0.750); /* linear */
    height: 20px;
}

.remove_tag{
    width: 15px;
    height: 15px;
    font-size: 8pt;
    text-align: center;
    border-radius: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: gainsboro;
    margin-left: 10px;
    color: gainsboro;
    background-color: white;
    cursor: pointer;
    transition: all 300ms cubic-bezier(0.250, 0.250, 0.750, 0.750); /* linear */
}
.remove_tag:hover{
    background-color: gainsboro;
    color: white;
}

.taglist:after{
    clear: both;
    display: block;
    content: " ";
}
.taglist li:hover{
    border-color: black;
}

.outer{
    outline: 0;
}
</style>
