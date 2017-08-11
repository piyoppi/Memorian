
<template>
    <div id="outer">
        <div id="header">
            <find-component @find="find"></find-component>
        </div>
        <transition-group tag="ul" id="snippet_list" v-on:leave="leave_bmark" >
            <li v-for="(item, index) in bookmarkList" class="bmark_item" v-bind:key="item.id">
                <bookmark-item-component :item="item" :index="index" @removed_bookmark="removedItem"></bookmark-item-component>
                <button class="btn_taglist" v-on:click="showTagList(item)" href="#"></button>
                <tag-list-component class="taglist" :item="item" :tags="item.tags"></tag-list-component>
                <transition name="tagsel" v-on:leave="leave_taglist" v-on:enter="show_taglist" v-bind:css="false">
                    <div class="tagselect_group" v-if="showTagKey == item.id" >
                        <tag-select-component :bookmarkItem="item" v-bind:key="index"></tag-select-component>
                    </div>
                </transition>
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
import TagListComponent from './taglist.vue'

let getDataAmount = 5;

export default {
    components: {
        FindComponent,
        BookmarkItemComponent,
        TagSelectComponent,
        TagListComponent,
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
            bmark.findKeywordOrTag({query: query, offset: 0, length: getDataAmount}, e=>{ this.bookmarkList = e; console.log(e); });
        },
        removedItem: function(item, index){
            this.bookmarkList.splice(index, 1);
        },
        paginate: function(){
            bmark.findKeywordOrTag({query: this.query, offset: this.bookmarkList.length, length: getDataAmount}, e=>{
                this.bookmarkList = this.bookmarkList.concat(e);
                if( e.length < getDataAmount ) this.isStopScroll = true;
            });
        },
        leave_bmark: function(el, done){
            Velocity(el, {height: "0px", opacity: 0}, {duration: 400, display: "none"}, {complete: done});
        },
        leave_taglist: function(el, done){
            Velocity(el, {height: "0px", opacity: 0}, {duration: 400, display: "none"}, {complete: done});
        },
        show_taglist: function(el, done){
            Velocity(el, {maxHeight: el.clientHeight + 500 + "px"}, {duration: 600}, {complete: done});
        },
        showTagList: function(item){
            this.showTagKey = ( this.showTagKey == item.id ) ? -1 : item.id;
        },
        attachedTag: function(tag){
        }
    },
    directives: {
    },
}
</script>


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

.tagselect_group{
    overflow: hidden;    
}

.btn_taglist{
    width: 22px;
    height: 22px;
    margin-top: 3px;
    background-image: url('../img/tag.png');
    background-color: white;
    background-repeat: no-repeat;
    background-position: center;
    border-style: none;
    background-color: none;
    border-radius: 3px;
    cursor: pointer;
}

.btn_taglist:hover{
    background-color: gainsboro;
}

.taglist{
    margin: 0;
    padding: 0;
    position: relative;
    top: -25px;
    left: 25px;
}


</style>
