
<template>
    <div id="outer">
        <div id="header">
            <find-component :isFocus="selectedIndex<0" @find="findStart" @focused="findComponentFocused" @lostFocus="findComponentLostFocused" id="findset"></find-component>
        </div>
        <transition-group tag="ul" id="snippet_list" v-on:leave="leave_bmark" >
            <li v-for="(item, index) in bookmarkList" v-on:click = "selectedIndex = index" v-bind:class="{ bmarkselected: (selectedIndex === index) }" v-selected="selectedIndex === index"  class="bmark_item" v-bind:key="item.id">
                <bookmark-item-component :item="item" :index="index" :selected="selectedIndex === index" @removed_bookmark="removedItem"></bookmark-item-component>
                <div class="bookmark_tags_outer">
                    <button class="btn_taglist" v-on:click="showTagList(item)" href="#"></button>
                    <tag-list-component class="taglist" :item="item" :tags="item.tags"></tag-list-component>
                </div>
                <transition name="tagsel" v-on:leave="transitionLeaveTags" v-on:enter="transitionShowTags" v-bind:css="false">
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
import FindComponent from './findset.vue'
import BookmarkItemComponent from './bookmark_item.vue'
import TagSelectComponent from './addtag_ui.vue'
import TagListComponent from './taglist.vue'
import JumpLink from './jump_link.js'

let bmark = new GetBmark();
let getDataAmount = 5;

export default {
    components: {
        FindComponent,
        BookmarkItemComponent,
        TagSelectComponent,
        TagListComponent,
    },
    props: [
        "show_type"
    ],
    data: function(){
        return{
            bookmarkList: [],
            query: "",
            isStopScroll: false,
            showTagKey: -1,
            selectedIndex: -1,
            keyCheckEnable: true,
            isFinding: false,
        }
    },
    created: function(){
        this.find("", 0, getDataAmount);
        bmark.onInsertedItem = this.insertedBookmark;
        document.addEventListener("scroll", ()=>{
            if( this.isStopScroll ) return;
            if( document.documentElement.clientHeight - window.innerHeight - window.scrollY < 10 ) this.paginate();
        }, false);
        document.addEventListener('keydown', this.keyCheck);
    },
    methods: {
        findComponentFocused: function(){
            this.keyCheckEnable = false;
            this.selectedIndex = -1;
        },
        findComponentLostFocused: function(){
            this.keyCheckEnable = true;
        },
        findStart: function(query){
            this.isStopScroll = false;
            this.query = query;
            this.bookmarkList = [];
            this.find(query, 0, getDataAmount);
        },
        find: function(query, offset, length){
            if( this.isFinding ) return;
            this.isFinding = true;
            bmark.findKeywordOrTag({query: this.query, offset: offset, length: length}, e=>{
                this.isFinding = false;
                this.bookmarkList = this.bookmarkList.concat(e);
                if( e.length < getDataAmount ) this.isStopScroll = true;
            });
        },
        removedItem: function(item, index){
            this.bookmarkList.splice(index, 1);
        },
        insertedBookmark: function(){
            bmark.get_bookmarks_request(0, getDataAmount, e => {console.log(e); this.bookmarkList = e; }); 
        },
        paginate: function(){
            this.find(this.query, this.bookmarkList.length, getDataAmount);
        },
        leave_bmark: function(el, done){
            Velocity(el, {height: "0px", opacity: 0}, {duration: 400, display: "none", complete: done});
        },
        transitionLeaveTags: function(el, done){
            Velocity(el, {height: "0px", opacity: 0}, {duration: 400, display: "none", complete: done});
        },
        transitionShowTags: function(el, done){
            let rect = el.getBoundingClientRect();
            let duration = ( (rect.bottom + window.scrollY) > (window.scrollY + window.innerHeight) ) ? 100 : 600;

            Velocity(el, {maxHeight: el.clientHeight + 500 + "px"}, {duration: duration, complete: function(){
                    let rectAfter = el.getBoundingClientRect();
                    if( (rectAfter.bottom + window.scrollY) > (window.scrollY + window.innerHeight) ){
                        setTimeout(()=>{window.scrollTo(0, rectAfter.bottom + window.scrollY - window.innerHeight)}, 10);
                    }
                    done();
                }
            });

        },
        showTagList: function(item){
            this.showTagKey = ( this.showTagKey == item.id ) ? -1 : item.id;
        },
        selectNextItem: function(){
            this.selectedIndex = ( this.selectedIndex < (this.bookmarkList.length-1) ) ? (this.selectedIndex+1) : -1;
        },
        selectPrevItem: function(){
            this.selectedIndex = ( this.selectedIndex >= 0 ) ? (this.selectedIndex-1) : (this.bookmarkList.length-1);
        },
        keyCheck: function(e){
            if( !this.keyCheckEnable ) return;
            let bmarkItem = this.bookmarkList[this.selectedIndex];
            switch(e.keyCode){

                case 9:
                    /*Tab key*/
                    if( this.showTagKey > -1 ) return;
                    if(e.shiftKey){
                        this.selectPrevItem();
                    }
                    else{
                        this.selectNextItem();
                    }
                    e.preventDefault();
                    break;

                case 74:
                    if( this.showTagKey > -1 ) return;
                    if( this.selectedIndex >= 0 ){
                        this.selectNextItem();
                        if( this.selectedIndex == -1 ) this.selectedIndex = 0;
                    }
                    break;

                case 75:
                    if( this.showTagKey > -1 ) return;
                    if( this.selectedIndex >= 0 ){
                        this.selectPrevItem();
                        if( this.selectedIndex == -1 ) this.selectedIndex = this.bookmarkList.length-1;
                    }
                    break;

                case 80:
                    /*'p' key*/
                    if( !bmarkItem ) return;
                    if( e.ctrlKey ){
                        this.showTagList(bmarkItem);
                        e.preventDefault();
                    }
                    break;

                case 40:
                    if( this.showTagKey > -1 ) return;
                    this.selectNextItem();
                    e.preventDefault();
                    break;

                case 38:
                    if( this.showTagKey > -1 ) return;
                    this.selectPrevItem();
                    e.preventDefault();
                    break;

                case 46:
                    /*Delete key*/
                    if( !bmarkItem ) return;
                    if( (this.selectedIndex < 0) || (this.selectedIndex >= this.bookmarkList.length) ) return;
                    bmark.removeItem(bmarkItem);
                    this.removedItem(bmarkItem, this.selectedIndex);
                    break;

                case 13:
                    /*Enter key*/
                    if( !bmarkItem || !(this.showTagKey < 0) ) return;
                    if( (this.selectedIndex < 0) || (this.selectedIndex >= this.bookmarkList.length) ) return;
                    let link_info = bmarkItem.captions.h6 || bmarkItem.captions.h5 || bmarkItem.captions.h4 ||
                                    bmarkItem.captions.h3 || bmarkItem.captions.h2 || bmarkItem.captions.h1;
                    if( this.show_type === "page" ){
                        JumpLink.Jump(bmarkItem, link_info);
                    }
                    else{
                        bmark.jump_link(bmarkItem, link_info);
                    }
                    break;

            }
        }
    },
    directives: {
        selected: {
            update: function(el, binding){
                if( !binding.value || binding.oldValue == binding.value ) return;
                let rect = el.getBoundingClientRect();
                console.log(rect);
                let scrY = window.scrollY;
                if( (rect.bottom + scrY) > (scrY + window.innerHeight) ){
                    window.scrollTo(0, rect.bottom + scrY - window.innerHeight);
                }
                else if( (rect.top + scrY) < scrY ){
                    window.scrollTo(0, (rect.top + scrY - 50));
                }
            },
        },
    },
}
</script>


<style scoped>
ul{
}
.bmark_item{
    padding: 0;
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: gainsboro;
    overflow: hidden;
    position: relative;
    padding: 5px;
}
.bmark_item:last-child{
    border-style: none;
}

#findset{
    max-width: 700px;
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
    margin-bottom: 0;
    background-image: url('../img/tag.png');
    background-color: white;
    background-repeat: no-repeat;
    background-position: center;
    border-style: none;
    background-color: none;
    border-radius: 3px;
    cursor: pointer;
    position: absolute;
}

.btn_taglist:hover{
    background-color: gainsboro;
}

.taglist{
    margin: 0;
    margin-bottom: 5px;
    padding: 0;
    margin-left: 25px;
}

.bmarkselected{
    background-color: #EEE;
}

#snippet_list{
    padding: 0;
    list-style-type: none;
    margin: 0;
    margin-top: 40px;
}

.bookmark_tags_outer{
    min-height: 30px;
}

</style>
