<template>
    <ul class="taglist">
        <li v-for="(tag, index) in tags" class="tags" v-bind:class="{ tagselected: (selectedIndex == index) }" v-on:click.self="tagClick(tag, index)">
            {{ tag.tagName }}
            <button class="remove_tag" v-show="item || tagRemoveEnable" v-on:click="detachTag(tag, index)">x</button>
        </li>
    </ul>
</template>

<script>
import getBmark from './get_bmark_controller.js'

export default {
    components: {
    },
    data: function(){
        return{
            selectedIndex: -1,
        }
    },
    props: [
        "item",
        "tags",
        "keyEnable",
        "tagRemoveEnable",
    ],
    created: function(){
        document.addEventListener('keydown', this.keyCheck);
    },
    watch: {
        tags: function(val){ this.selectedIndex = -1 },
        selectedIndex: function(val){
            if( val < 0 ){
                this.$emit('unselected');
            }
            else{
                this.$emit('selectedChanged', this.selectedIndex);
            }
    }
    },
    methods: {
        detachTag: function(tag, index){
            if( this.tagRemoveEnable ){
                getBmark.removeTag(tag.id, e=>console.log("removed tag"));
                let idx = this.tags.findIndex( item => item.id == tag.id );
                if( idx >= 0 ) this.tags.splice( idx, 1 );
                this.$emit('tagRemoved', tag);
            }
            else if(this.item){
                getBmark.detachTag(this.item.id, tag.id, ()=>{
                    this.$emit('tagDetached', tag);
                });
                this.item.tags.splice(index, 1);
            }
        },
        tagClick: function(tag, index){
            this.$emit('tagClick', tag);
        },
        selectNextItem: function(){
            this.selectedIndex = ( this.selectedIndex < this.tags.length-1 ) ? (this.selectedIndex+1) : -1;
        },
        selectPrevItem: function(){
            this.selectedIndex = ( this.selectedIndex >= 0 ) ? (this.selectedIndex-1) : (this.tags.length-1);
        },
        keyCheck: function(e){
            if( (!this.keyEnable) || (this.tags.length === 0) ) return;
            switch(e.keyCode){
                case 9:
                    if(e.shiftKey){
                        this.selectPrevItem();
                    }
                    else{
                        this.selectNextItem();
                    }
                    console.log(this.tags.length);
                    e.preventDefault();
                    break;
                case 13:
                    if( (this.selectedIndex >= 0) && (this.selectedIndex < this.tags.length) ) this.$emit('tagClick', this.tags[this.selectedIndex] );
                    break;

                case 40:
                    this.selectPrevItem();
                    break;

                case 38:
                    this.selectNextItem();
                    break;
            }
        }
    },
    directives: {
    },
}
</script>

<style scoped>

.taglist{
    list-style-type: none;
    padding-left: 0;
}

.tags{
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
    background-color: white;
}

.tags:hover{
    border-color: black;
}

.tagselected{
    border-color: blue;
    border-style: solid;
}

.remove_tag{
    width: 16px;
    height: 16px;
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
    padding: 0;
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

</style>
