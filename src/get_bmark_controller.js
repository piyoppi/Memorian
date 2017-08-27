"use strict mode"


export default class popup_controller{

    constructor(){
        this._callback_buffer = {};
        this.onInsertedItem = null;
        this.id = this.keygen();

        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                switch( request.key ){
                    case "insertedBookmarks":
                        if( this.onInsertedItem ) this.onInsertedItem();
                        break;

                    default:
                        if( request.key in this._callback_buffer ){
                            if( this._callback_buffer[request.key].callback ) this._callback_buffer[request.key].callback(request.data);
                            delete this._callback_buffer[request.key];
                        }
                        break;

                }
            }
        );
    }

    keygen(){
        return String(Math.random() * 100000);
    }

    get_bookmarks_request(offset, len, callback){
        chrome.runtime.sendMessage({id: "get_bookmarks", offset: offset, length: len}, e=>callback(e.data));
    }

    getBookmarksAll(callback){
        chrome.runtime.sendMessage({id: "getBookmarksAll"}, e=>callback(e.data));
    }

    insertBookmarks(data, callback){
        chrome.runtime.sendMessage({id: "insertBookmarks", data: data}, e=>callback(e));
    }

    removeItem(dataKey, callback){
        chrome.runtime.sendMessage({id: "remove_item", dataKey: dataKey}, e=>callback());
    }

    removeCode(dataKey, index, callback){
        chrome.runtime.sendMessage({id: "remove_code", dataKey: dataKey, index: index}, e=>callback());
    }

    attachTag(dataKey, tagName, callback){
        chrome.runtime.sendMessage({id: "attachTag", datakey: dataKey, tagName: tagName}, e=>callback(e.data));
    }

    removeTag(tagKey, callback){
        chrome.runtime.sendMessage({id: "removeTag", tagKey: tagKey}, e=>callback(e.data));
    }

    getTagsAll(callback){
        chrome.runtime.sendMessage({id: "getTagsAll"}, e=>callback(e.data));
    }

    jump_link(item, tag){
        chrome.tabs.query({active: true, currentWindow: true}, tab=>{
            chrome.tabs.sendMessage(tab[0].id, {id: "jump_link", item: item, tag: tag }, (e)=>{});
        });
    }

    detachTag(dataKey, tagKey, callback){
        chrome.runtime.sendMessage({id: "detachTag", datakey: dataKey, tagKey: tagKey}, e=>callback(), ()=>{});
    }

    findUsingTag(query, callback){
        chrome.runtime.sendMessage({id: "findUsingTag", query: query}, e=>callback(e.data));
    }

    find(query, callback){
        chrome.runtime.sendMessage({id: "find", query: query}, e=>callback(e.data));
    }

    findKeywordOrTag(query, callback){
        if( query.query === "" ){
            this.get_bookmarks_request(query.offset, query.length, callback);
        }
        else if( query.query.substr(0, 2) === "t:" ){
            query.query = query.query.substr(2);
            this.findUsingTag(query, callback);
        }
        else{
            this.find(query, callback);
        }
    }

}
