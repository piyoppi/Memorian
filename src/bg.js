import bookmarkStore from './bookmark_store.js'

var bStore = new bookmarkStore();

function contextMenu_Click(info, tab){
    chrome.tabs.sendMessage(tab.id, {hoge: "text_memo"}, function(response) {
    });
}

function mnu_ElementMemo_click(info, tab){
    chrome.tabs.sendMessage(tab.id, {id: "element_memo"}, function(response) {
        bStore.addContentIntoBookmarkData(response).then( e => {})
        .catch( e=>{
            bStore.setBookmarkData(response);
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
                    console.log(`get ${request.offset}  ${request.length}`); 
                    bStore.getBookmarks( request.offset, request.length).then( e => { retValue({data: e, key: request.key}) });
                    break;

                case "remove_item":
                    bStore.removeBookmark(request.key);
                    break;

                case "remove_code":
                    bStore.removeCode(request.key, request.index);
                    break;

                case "findUsingTag":
                    bStore.findUsingTagFromQueryString(request.query).then( e => retValue({data: e, key: request.key}) );
                    break;

                case "find":
                    console.log(`find ${request.offset}  ${request.length}`); 
                    bStore.find(request.query, e => { retValue({data: e, key: request.key}) });
                    break;

                case "insertBookmarks":
                    bStore.insertBookmarks(request.data).then( e => {
                        retValue({key: "insertedBookmarks"});
                        retValue({data: e, key: request.key});
                    } );
                    break;

                case "attachTag":
                    bStore.attachTagFromDataKey(request.datakey, request.tagName).then( e=>{
                        retValue({data: e, key: request.key});
                    })
                    .catch(e=>{
                        retValue({data: null});
                    });
                    break;

                case "removeTag":
                    bStore.detachTagFromAllBookmark(request.tagKey)
                        .then( e => bStore.removeTag(request.tagKey) );
                    break;

                case "detachTag":
                    bStore.detachTagFromDataKey(request.datakey, request.tagKey, e=>{ retValue({data: e, key: request.key}) });
                    break;

                case "getTagsAll":
                    bStore.getTagsAll().then(e => retValue({data: e, key: request.key}));
                    break;

                case "getBookmarksAll":
                    bStore.getAllBookmarks().then(e => {console.log(e);retValue({data: e, key: request.key});});
                    break;

                case "showBookmarks":
                    chrome.tabs.create({"url": "html/bg.html" });
                    break;

                default:
                    sendResponse("none");
                    break;

            }
        });

