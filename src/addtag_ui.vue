
<template>
    <div>
        <input class="taginput" type="text"
               v-inputFocus
               v-model="tagInput"
               v-on:keyup.enter="addTagFromEnterKey"
               v-on:focus="isTaglistKeyEnable = true"
               v-on:blur="isTaglistKeyEnable = false"
               ></input>
        <button class="add_tag" v-on:click="addTag()" href="#">Add</button>
        <tag-list-component class="taglist" :tagRemoveEnable="true" :keyEnable="isTaglistKeyEnable" :tags="getTagList" @unselected="tagUnselected" @selectedChanged="tagSelectedChanged" @tagClick="selectTag"></tag-list-component>
    </div>
</template>


<script>
import GetBmark from './get_bmark_controller.js'
let bmark = new GetBmark();
import arraySearcher from 'array_searcher'
let searcher = new arraySearcher();
import TagListComponent from './taglist.vue'

export default {
    components: {
        TagListComponent 
    },
    data: function(){
        return{
            tagInput: "",
            tags: [],
            isTaglistKeyEnable: false,
            isActiveTagList: false,
        }
    },
    props: [
        "bookmarkItem"
    ],
    created: function(){
        bmark.getTagsAll( e => {
            this.tags = e;
            this.initializeTagSearch();
        } );
    },
    computed: {
        getTagList: function(){
            if( this.tagInput === "" ){
                return this.tags;
            }
            else{
                return searcher.search(this.tagInput);
            }
        },
    },
    methods: {
        initializeTagSearch: function(){
            searcher.setHash(this.tags, ["tagName"]);
        },
        tagUnselected: function(){
            this.isActiveTagList = false;
        },
        tagSelectedChanged: function(index){
            this.isActiveTagList = true;
        },
        selectTag: function(tag){
            bmark.attachTag(this.bookmarkItem.id, tag.tagName, e=>{
                if( !tag ) return;
                this.bookmarkItem.tags.push(tag);
            });
        },
        addTagFromEnterKey: function(){
            if( !this.isActiveTagList ) this.addTag();
        },
        addTag: function(){
            if( this.tagInput == "" ) return;
            bmark.attachTag(this.bookmarkItem.id, this.tagInput, taginfo=>{
                if( !taginfo || !taginfo.tag ) return;
                if( taginfo.isAddTag ) this.tags.push(taginfo.tag);
                this.bookmarkItem.tags.push(taginfo.tag);
                this.initializeTagSearch();
            });
        },
    },
    directives: {
        inputFocus:{ bind: function(el, value){ setTimeout( ()=>{ el.focus(); }, 1); } }
    },
}
</script>

<style scoped>
ul{
    list-style-type: none;
}
ul:after{
    clear: both;
    display: block;
    content: " ";
}
li{
    display: block;
    float: left;
    border-radius: 3px;
    border-style: solid;
    border-width: 1px;
    margin: 2px;
    padding: 3px 6px;
    cursor: pointer;
    border-color: gainsboro;
    transition: all 300ms cubic-bezier(0.250, 0.250, 0.750, 0.750); /* linear */
}
li:hover{
    border-color: black;
}
.remove_tag{
    width: 20px;
    height: 20px;
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

.add_tag{
    border-radius: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: gainsboro;
    margin-left: 10px;
    color: gainsboro;
    background-color: white;
    cursor: pointer;
    padding: 3px 15px;
}

.taglist{
    padding-left: 0;
}

.taglist:after{
    display: block;
    clear: both;
    content: " ";
}

.taginput{
    padding: 2px 5px;
    margin: 5px 0;
}

</style>
