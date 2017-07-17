
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
        var data = { block_html: response.block, url: response.url, title: response.title, addinfo_tostr: response.send_additional_info_tostr };
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

function get_new_bookmarks(){
    alert("hoge");
}
