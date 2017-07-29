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
    border-style: none;
    position: absolute;
}
.outer{
    position: relative;
}
</style>

<template>
    <div class="outer">
        <input id="query_textbox" type="text" v-model="query" v-inputFocus v-on:keyup.enter="find()">
        <input type="button" value="" v-on:click="find()">
    </div>
</template>

<script>
export default{
    data: function(){
        return {
            query: ""
        }
    },
    created: function(){
    },
    methods: {
        find: function(){
            this.$emit('find', this.query);
        },
        focus: function(){
        }
    },
    directives: {
        inputFocus:{ bind: function(el, value){ setTimeout( ()=>{ el.focus(); }, 1); } }
    }
}
</script>
