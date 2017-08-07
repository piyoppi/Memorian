

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
    position: relative;
}
.bmark_item:last-child{
    border-style: none;
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
                <bookmark-item-component :item="item" :index="index" @removed_bookmark="removedItem"></bookmark-item-component>
                <button class="btn_taglist" v-on:click="showTagList(item)" href="#">tag</button>
                <tag-select-component :bookmarkItem="item" v-show="showTagKey == item.id"></tag-select-component>
            </li>
        </transition-group>
    </div>
</template>

<script>
import GetBmark from './get_bmark_controller.js'
import Velocity from 'velocity-animate'

let bmark = new GetBmark();
import FindComponent from './findset.vue'
import BookmarkItemComponent from './bookmark_item.vue'
import TagSelectComponent from './addtag_ui.vue'

let getDataAmount = 5;

export default {
    components: {
        FindComponent,
        BookmarkItemComponent,
        TagSelectComponent
    },
    data: function(){
        return{
            bookmarkList: [],
            query: "",
            isStopScroll: false,
            showTagKey: -1,
        }
    },
    created: function(){
        bmark.get_bookmarks_request(0, getDataAmount, e => this.bookmarkList = e); 
        document.addEventListener("scroll", ()=>{
            if( this.isStopScroll ) return;
            if( document.documentElement.clientHeight - window.innerHeight - window.scrollY < 10 ) this.paginate();
        }, false);
    },
    methods: {
        find: function(query){
            this.isStopScroll = false;
            this.query = query;
            bmark.find({query: query, offset: 0, length: getDataAmount}, e=>{ this.bookmarkList = e; });
        },
        removedItem: function(item, index){
            this.bookmarkList.splice(index, 1);
        },
        paginate: function(){
            bmark.find({query: this.query, offset: this.bookmarkList.length, length: getDataAmount}, e=>{
                this.bookmarkList = this.bookmarkList.concat(e);
                if( e.length < getDataAmount ) this.isStopScroll = true;
            });
        },
        leave_bmark: function(el, done){
            Velocity(el, {height: "0px", opacity: 0}, {duration: 400, display: "none"}, {complete: done});
        },
        showTagList: function(item){
            this.showTagKey = ( this.showTagKey == item.id ) ? -1 : item.id;
        }
    },
    directives: {
    },
}
</script>
