<style scoped>
input[type="text"]{
    padding: 3px;
    width: 100%;
    height: 35px;
    border-width: 0 0 1px 0;
    border-color: gainsboro;
    outline: 0;
    margin: 0 10px;
    box-sizing: content-box;
}
input[type="button"]{
    background-image: url('../img/megane.png');
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    width: 30px;
    height: 30px;
    right: 5px;
    top: 3px;
    margin-top: 2px;
    border-style: none;
    position: absolute;
}
.outer{
    position: relative;
}

.findtags{
    
}
</style>

<template>
    <div class="outer">
        <input id="query_textbox" type="text" v-model="query"
               v-inputFocus
               v-on:keyup.enter="find()"
               v-on:focus="textFocus()"
               v-on:blur="textBlur()"
               >
        <input type="button" value="" v-on:click="find()">
        <tag-list-component class="findtags" v-show="findTag.length>0" :keyEnable="isTaglistKeyEnable" :tags="findTag" @tagClick="tagClick"></tag-list-component>
               
    </div>
</template>

<script>
import TagListComponent from './taglist.vue'
import arraySearcher from 'array_searcher'
import GetBmark from './get_bmark_controller.js'
let bmark = new GetBmark();
let searcher = new arraySearcher();

export default{
    components: {
        TagListComponent,
    },
    data: function(){
        return {
            query: "",
            tags: [],
            isTaglistKeyEnable: false,
        }
    },
    created: function(){
        bmark.getTagsAll( e => {
            this.tags = e;
            searcher.setHash(this.tags, ["tagName"]);
        } );
    },
    computed: {
        findTag: function(){
            return searcher.search(this.query);
        }
    },
    watch: {
        query: function(val){
            if( val !== "" ){
                this.$emit('focused');
            }
            else{
                this.$emit('lostFocus');
            }
        }
    },
    methods: {
        find: function(){
            this.$emit('find', this.query);
            this.$emit('lostFocus');
        },
        tagClick: function(tag){
            this.query = "t: " + tag.tagName;
            this.$emit('find', this.query);
        },
        textFocus: function(){
            this.isTaglistKeyEnable = true;
            if( this.query !== "" ) this.$emit('focused');
        },
        textBlur: function(){
            this.isTaglistKeyEnable = false;
            this.$emit('lostFocus');
        },
    },
    directives: {
        inputFocus:{ bind: function(el, value){ setTimeout( ()=>{ el.focus(); }, 1); } }
    }
}
</script>
