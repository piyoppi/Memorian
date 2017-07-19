
var db_version = 2.3;
var db;
var transaction;

function contextMenu_Click(info, tab){
    chrome.tabs.sendMessage(tab.id, {hoge: "text_memo"}, function(response) {
    });
}

function mnu_ElementMemo_click(info, tab){
    chrome.tabs.sendMessage(tab.id, {id: "element_memo"}, function(response) {
        console.log( response );
        transaction = db.transaction(["bookmarks"], "readwrite");
        var objectStore = transaction.objectStore("bookmarks");
        var data = { block: response.block,
                     url: response.url,
                     title: response.title,
                     header_tag_text: response.header_tag_text
        };
        var request = objectStore.add(data);
        request.onsuccess = function(e) { console.log("success!!!"); };
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
    console.log("upgrade!!");
};

function get_new_bookmarks(callback){
    let transaction = db.transaction(["bookmarks"], "readwrite");
    let objectStore = transaction.objectStore("bookmarks");
    let data = [];
    console.log("start");
    objectStore.openCursor().onsuccess = function(e){
        var cursor = e.target.result;
        if( cursor ){
            console.log(cursor.key);
            data.push( {num: cursor.key, data: cursor.value} );
            cursor.continue();
        }
        else{
            console.log("end");
            callback(data);
        }
    }
}

function retValue(obj){
    chrome.runtime.sendMessage(obj, ()=>{});
}

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if( request.id === "get_bookmarks" ){
                get_new_bookmarks( (e)=>{ console.log(e); retValue({data: e, key: request.key}) });
            }
            else{
                sendResponse("none");
            }
        });

