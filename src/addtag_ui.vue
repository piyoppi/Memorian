
<template>
    <div>
        <input class="taginput" type="text" v-model="tagInput"></input>
        <button class="add_tag" v-on:click="addTag()" href="#">Add</button>
        <ul class="taglist">
            <li v-for="(tag, index) in getTagList" v-on:click.self="selectTag(tag)">
                {{ tag.tagName }}
                <button class="remove_tag" v-on:click="removeTag(tag, index)">x</button>
            </li>
        </ul>
    </div>
</template>


<script>
import GetBmark from './get_bmark_controller.js'
let bmark = new GetBmark();
import arraySearcher from 'array_searcher'
let searcher = new arraySearcher();

export default {
    components: {
    },
    data: function(){
        return{
            tagInput: "",
            tags: [],
        }
    },
    props: [
        "bookmarkItem"
    ],
    created: function(){
        bmark.getTagsAll( e => {
            this.tags = e;
            searcher.setHash(this.tags, ["tagName"]);
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
        selectTag: function(tag){
            bmark.attachTag(this.bookmarkItem.id, tag.tagName, e=>{
                if( !tag ) return;
                this.bookmarkItem.tags.push(tag);
            });
        },
        addTag: function(){
            bmark.attachTag(this.bookmarkItem.id, this.tagInput, tag=>{
                if( !tag ) return;
                this.tags.push(tag);
                this.bookmarkItem.tags.push(tag);
            });
        },
        removeTag: function(tag, index){
            bmark.removeTag(tag.id, e=>{this.tags.push(e);});
            this.tags.splice(index, 1);
        }
    },
    directives: {
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
