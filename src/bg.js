import bookmarkStore from './bookmark_store.js'

//chrome.storage.local.set({'version': 0}, ()=>{});
//chrome.storage.local.set({'savedVersion': 0}, ()=>{});

var selectionLengthThreshold = 20;
var bStore = new bookmarkStore();

function regBookmark(tab, response){
        bStore.addContentIntoBookmarkData(response).then( e => {
            sendUpdateInfo(tab, response);
        })
        .catch( e=>{
            if( e.code && e.code === 10000 ){
                bStore.setBookmarkData([response]).then(e=>{ sendUpdateInfo(tab, response); })
                .catch( e => { chrome.tabs.sendMessage(tab.id, {id: "error", content: e}, ()=>{}); } );
            }
            else{
                chrome.tabs.sendMessage(tab.id, {id: "error", content: e}, ()=>{});
            }
        });
}

function sendUpdateInfo(tab, response){
    chrome.tabs.sendMessage(tab.id, {id: "registered_item", content: response.content}, ()=>{});
    sendEvent({key: "getAddBookmark"});
}

function contextMenu_Click(info, tab){
    chrome.tabs.sendMessage(tab.id, {id: "element_memo"}, function(response) {
        if( response.selectionText.length > selectionLengthThreshold ){
            response.content = response.selectionText;
        }
        regBookmark(tab, response);
    });
}

function mnu_ElementMemo_click(info, tab){
    chrome.tabs.sendMessage(tab.id, {id: "element_memo"}, function(response) {
        regBookmark(tab, response);
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
                    console.log("insertedBookmark");
                    try {
                        bStore.insertBookmarks(request.data).then( e => {
                            let errorMessage = "";
                            if( e.missingDatas.length > 0 ){
                                errorMessage += `${e.missingDatas.length}個のアイテムの登録に失敗しました。データが不正な可能性があります。`;
                            }
                            if( e.missingTags.length > 0 ){
                                errorMessage += `${e.missingTags.length}個のタグの登録に失敗しました。データが不正な可能性があります。`;
                            }
                            if( errorMessage !== "" ) alert( errorMessage );
                            sendEvent({key: "insertedBookmarks"});
                            sendResponse({data: e});
                        } )
                    }
                    catch(e){
                        if( e.diff && e.code && e.code == 2 ) alert(`アイテム最大数を超えるため追加に失敗しました。${e.diff}個のアイテムを削除してください。`);
                        if( e.diff && e.code && e.code == 4 ) alert(`タグ最大数を超えるため追加に失敗しました。${e.diff}個のタグを削除してください。`);
                    }
                    return true;
                    break;

                case "attachTag":
                    bStore.attachTagFromDataKey(request.datakey, request.tagName).then( e=>{
                        sendResponse({data: e});
                    })
                    .catch(e=>{
                        if( e.code ){
                            switch(e.code){
                                case 3: alert("タグの文字列が長すぎます"); break;
                                case 4: alert("タグ数の最大値を超えたためタグの追加に失敗しました。タグを削除してください。"); break;
                            }
                        }
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

