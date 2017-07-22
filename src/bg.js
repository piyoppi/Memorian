
var db_version = 2.3;
var db;
var transaction;

function contextMenu_Click(info, tab){
    chrome.tabs.sendMessage(tab.id, {hoge: "text_memo"}, function(response) {
    });
}

function mnu_ElementMemo_click(info, tab){
    chrome.tabs.sendMessage(tab.id, {id: "element_memo"}, function(response) {
        transaction = db.transaction(["bookmarks"], "readwrite");
        var objectStore = transaction.objectStore("bookmarks");
        var data = { block: response.block,
                     url: response.url,
                     title: response.title,
                     header_tag_text: response.header_tag_text,
                     tags: response.tags
        };
        var request = objectStore.add(data);
        request.onsuccess = function(e) { };
    });
}

chrome.contextMenus.create({
    title: "この部分を切り抜く",
    contexts: ["selection"],
    onclick: contextMenu_Click
});

chrome.contextMenus.create({
    title: "この部分を切り抜く",
    onclick: mnu_ElementMemo_click
});

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var request = window.indexedDB.open("Bookmarkers", db_version);
request.onsuccess = (e) => { db = e.target.result; }
request.onerror = () => {};
request.onupgradeneeded = (e) => { 
    var db = e.target.result;
    var objectStore = db.createObjectStore("bookmarks", { autoIncrement: true });
};

function get_new_bookmarks(callback){
    let transaction = db.transaction(["bookmarks"], "readwrite");
    let objectStore = transaction.objectStore("bookmarks");
    let data = [];
    objectStore.openCursor().onsuccess = function(e){
        var cursor = e.target.result;
        if( cursor ){
            let ret_val = cursor.value;
            ret_val.key = cursor.key;
            data.push( ret_val );
            cursor.continue();
        }
        else{
            callback(data);
        }
    }
}

function remove_bookmark(key){
    console.log("delete " + key);
    let transaction = db.transaction(["bookmarks"], "readwrite");
    let objectStore = transaction.objectStore("bookmarks");
    objectStore.delete(key);
}

function retValue(obj){
    chrome.runtime.sendMessage(obj, ()=>{});
}

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(request);
            switch( request.id ){
                case "get_bookmarks":
                    get_new_bookmarks( (e)=>{ console.log(e); retValue({data: e, key: request.key}) });
                    break;

                case "remove_item":
                    remove_bookmark(request.key);
                    break;

                default:
                    sendResponse("none");
                    break;

            }
        });

