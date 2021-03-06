import selection from './selection.js'
import parser from './bmark_parser.js'
import jLink from './jump_link.js'
import Vue from 'vue'
var jumpLink = new jLink();
var appOptions = require('./msg.vue');

let el = document.createElement("div");
el.id = "chrome_extension_bmark_msg";
document.body.appendChild(el);
let app = new Vue(appOptions).$mount("#" + el.id);
app.hide();


var selectbox = new selection(document.body);
var bmark_parser = new parser(document.body);

var curpos = {x: 0, y: 0};

function find_element_fromcurpos(){
    let obj = document.elementFromPoint(curpos.x, curpos.y);
    let block_elem = bmark_parser.parse( obj );
    let additional_info = bmark_parser.get_information_tagsearch( block_elem );

    let send_additional_info = {};
    let header_tag_text = "";
    additional_info.forEach( (info) => {
        if( info.elements.length > 0 ){
            let elem = info.elements[0];
            let set_innertext = elem.innerText;
            send_additional_info[info.elem] = {tagName: info.elem, text: set_innertext, id: elem.id, class: elem.className};
            header_tag_text += set_innertext + "<,>";
        }
    });
    header_tag_text = header_tag_text.substr(0, header_tag_text.length-3);


    return {
        content: block_elem.innerText,
        title: document.title,
        url: window.location.href,
        header_tag_text: header_tag_text,
        captions: send_additional_info,
        selectionText: window.getSelection().toString()
    };
}

function showRegisteredContent(text){
    app.show(text, 2500);
}

function handler_mousemove(e){
    curpos.x = e.clientX;
    curpos.y = e.clientY;
}


jumpLink.JumpToElementAfterLoad();

document.addEventListener("contextmenu", handler_mousemove, false);

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    switch( request.id ){
        case "element_memo":
            sendResponse(find_element_fromcurpos());
            break;

        case "registered_item":
            showRegisteredContent(request.content);
            break;

        case "error":
            let msg = "登録に失敗しました"
            switch( request.content.code ){
                case 1: msg="文字数が長すぎて登録できませんでした。"; break;
                case 2: msg="これ以上アイテムを登録できません。古いアイテムを削除してください"; break;
            }
            alert("コードスニペットメモツール「めもりあん」からのメッセージ：" + msg);
            break;

        case "jump_link":
            jumpLink.Jump(request.item, request.tag);
            break;

        default:
            sendResponse();
    }
});



document.addEventListener('keydown', function(e){
    switch(e.keyCode){
        case 77:
            if( e.ctrlKey ) chrome.runtime.sendMessage({id: "showBookmarks"}, (e)=>{}); 
    }
}, false);

