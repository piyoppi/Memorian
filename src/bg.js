import bookmarkStore from './bookmark_store.js'

var selectionLengthThreshold = 20;
var bStore = new bookmarkStore();

function contextMenu_Click(info, tab){
    chrome.tabs.sendMessage(tab.id, {id: "element_memo"}, function(response) {
        if( response.selectionText.length > selectionLengthThreshold ){
            response.content = response.selectionText;
        }
        bStore.addContentIntoBookmarkData(response).then( e => {})
        .catch( e=>{
            bStore.setBookmarkData(response);
        });
        chrome.tabs.sendMessage(tab.id, {id: "registered_item", content: response.content}, ()=>{});
    });
}

function mnu_ElementMemo_click(info, tab){
    chrome.tabs.sendMessage(tab.id, {id: "element_memo"}, function(response) {
        bStore.addContentIntoBookmarkData(response).then( e => {})
        .catch( e=>{
            bStore.setBookmarkData(response);
        });
        chrome.tabs.sendMessage(tab.id, {id: "registered_item", content: response.content}, ()=>{});
    });
}

chrome.contextMenus.create({ title: "この部分を切り抜く", contexts: ["selection"], onclick: contextMenu_Click });
chrome.contextMenus.create({ title: "この部分を切り抜く", onclick: mnu_ElementMemo_click });

function sendEvent(obj){
    chrome.runtime.sendMessage(obj, ()=>{});
}

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            switch( request.id ){
                case "get_bookmarks":
                    console.log(`get ${request.offset}  ${request.length}`); 
                    bStore.getBookmarks( request.offset, request.length).then( e => sendResponse({data: e}));
                    return true;
                    break;

                case "remove_item":
                    bStore.removeBookmark(request.dataKey).then( e => sendResponse() );
                    return true;
                    break;

                case "remove_code":
                    bStore.removeCode(request.dataKey, request.index).then( e => sendResponse() );
                    return true;
                    break;

                case "findUsingTag":
                    bStore.findUsingTagFromQueryString(request.query).then( e => sendResponse({data: e}) );
                    return true;
                    break;

                case "find":
                    console.log(`find ${request.offset}  ${request.length}`); 
                    bStore.find(request.query, e => sendResponse({data: e}));
                    return true;
                    break;

                case "insertBookmarks":
                    bStore.insertBookmarks(request.data).then( e => {
                        sendEvent({key: "insertedBookmarks"});
                        sendResponse({data: e});
                    } );
                    return true;
                    break;

                case "attachTag":
                    bStore.attachTagFromDataKey(request.datakey, request.tagName).then( e=>{
                        sendResponse({data: e});
                    })
                    .catch(e=>{
                        sendResponse({data: null});
                    });
                    return true;
                    break;

                case "removeTag":
                    bStore.detachTagFromAllBookmark(request.tagKey)
                        .then( e => {
                            bStore.removeTag(request.tagKey);
                            sendResponse({data: 'removed_tag'});
                        });
                    return true;
                    break;

                case "detachTag":
                    bStore.detachTagFromDataKey(request.datakey, request.tagKey).then( e=>sendResponse({data: e}) );
                    return true;
                    break;

                case "getTagsAll":
                    bStore.getTagsAll().then(e => sendResponse({data: e}));
                    return true;
                    break;

                case "getBookmarksAll":
                    bStore.getAllBookmarks().then(e => sendResponse({data: e}));
                    return true;
                    break;

                case "sendUpdatedToBookmarkPage":
                    sendEvent({key: "getUpdatedByBookmarkPopup"});
                    break;

                case "showBookmarks":
                    chrome.tabs.create({"url": "html/bg.html" });
                    break;

                default:
                    sendResponse("none");
                    break;

            }
        });

