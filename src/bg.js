//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
//window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
import simpleSearcher from './simple_searcher.js'

var db_version = 2.3;
var db;
var transaction;

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


function getTextForDuplicateCheck(data){
    return data.title + data.header_tag_text + data.url;
}

function updateBookmarkData(data){
    let dupchk_text = getTextForDuplicateCheck(data);
    transaction = db.transaction(["bookmarks"], "readwrite");
    let objectStore = transaction.objectStore("bookmarks");
    let index = objectStore.index("text_for_dupcheck");
    return new Promise((resolve, reject) => {
        let get_item = index.get(dupchk_text);
        get_item.onsuccess = e => {
            let updateData = e.target.result;
            if( !updateData ){ reject(e); return; }
            updateData.contents.push(data.content);
            var requestUpdate = objectStore.put(updateData);
            requestUpdate.onerror = e => { reject(e) };
            requestUpdate.onsuccess = e => { resolve(e) };
        }
        get_item.onerror = e => { reject(e); }
    });
}

function setBookmarkData(data){
    transaction = db.transaction(["bookmarks"], "readwrite");
    let objectStore = transaction.objectStore("bookmarks");
    let textForFinding = data.content+ " " + data.header_tag_text + " " + data.title;
    let textForDuplicateCheck = getTextForDuplicateCheck(data);
    let addData = { contents: [data.content],
        url: data.url,
        title: data.title,
        header_tag_text: data.header_tag_text,
        tags: data.tags,
        text_for_finding: textForFinding.toLowerCase(),
        text_for_dupcheck: textForDuplicateCheck
    };
    var request = objectStore.add(addData);
    request.onsuccess = function(e) { };
}

chrome.contextMenus.create({ title: "この部分を切り抜く", contexts: ["selection"], onclick: contextMenu_Click });
chrome.contextMenus.create({ title: "この部分を切り抜く", onclick: mnu_ElementMemo_click });

var request = window.indexedDB.open("Bookmarkers", db_version);
request.onsuccess = (e) => { db = e.target.result; }
request.onerror = () => {};
request.onupgradeneeded = (e) => { 
    var db = e.target.result;
    var objectStore = db.createObjectStore("bookmarks", {keyPath: "id", autoIncrement: true });
    objectStore.createIndex("text_for_dupcheck", "text_for_dupcheck", { unique: true });
};

function get_all_bookmarks(callback){
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
    let transaction = db.transaction(["bookmarks"], "readwrite");
    let objectStore = transaction.objectStore("bookmarks");
    objectStore.delete(key);
}

function retValue(obj){
    chrome.runtime.sendMessage(obj, ()=>{});
}

function find(query, callback){
    let searcher = new simpleSearcher();
    get_all_bookmarks(e=>{
        callback( searcher.find(e, query, ["text_for_finding"]) );
    });
}

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            switch( request.id ){
                case "get_bookmarks":
                    get_all_bookmarks( (e)=>{ retValue({data: e, key: request.key}) });
                    break;

                case "remove_item":
                    remove_bookmark(request.key);
                    break;

                case "find":
                    find(request.query, (e)=>{ retValue({data: e, key: request.key}) });
                    break;

                default:
                    sendResponse("none");
                    break;

            }
        });

