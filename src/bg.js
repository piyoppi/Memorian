//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
//window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
import bookmarkStore from './bookmark_store.js'

var bStore = new bookmarkStore({version: "2.3"});

function contextMenu_Click(info, tab){
    chrome.tabs.sendMessage(tab.id, {hoge: "text_memo"}, function(response) {
    });
}

function mnu_ElementMemo_click(info, tab){
    chrome.tabs.sendMessage(tab.id, {id: "element_memo"}, function(response) {
        updateBookmarkData(response).then( e => {
        })
        .catch( e=>{
            setBookmarkData(response);
        });
    });
}


chrome.contextMenus.create({ title: "この部分を切り抜く", contexts: ["selection"], onclick: contextMenu_Click });
chrome.contextMenus.create({ title: "この部分を切り抜く", onclick: mnu_ElementMemo_click });

function retValue(obj){
    chrome.runtime.sendMessage(obj, ()=>{});
}

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            switch( request.id ){
                case "get_bookmarks":
                    bStore.getBookmarks( request.offset, request.length, (e)=>{ retValue({data: e, key: request.key}) });
                    break;

                case "remove_item":
                    bStore.remove_bookmark(request.key);
                    break;

                case "find":
                    bStore.find(request.query, (e)=>{ retValue({data: e, key: request.key}) });
                    break;

                default:
                    sendResponse("none");
                    break;

            }
        });

