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

    setCallback(callback = null){
        let key = this.keygen();
        this._callback_buffer[ key ] = {controllerID: this.id, callback: callback};
        return key;
    }


    keygen(){
        return String(Math.random() * 100000);
    }

    get_bookmarks_request(offset, len, callback){
        let key = this.setCallback(callback);
        chrome.runtime.sendMessage({id: "get_bookmarks", offset: offset, length: len, key: key}, (e)=>{});
    }

    getBookmarksAll(callback){
        let key = this.setCallback(callback);
        chrome.runtime.sendMessage({id: "getBookmarksAll", key: key}, (e)=>{});
    }

    insertBookmarks(data, callback){
        let key = this.setCallback(callback);
        chrome.runtime.sendMessage({id: "insertBookmarks", data: data, key: key}, (e)=>{});
    }

    removeItem(dataKey){
        let key = this.setCallback();
        chrome.runtime.sendMessage({id: "remove_item", key: key, dataKey: dataKey}, (e)=>{});
    }

    removeCode(dataKey, index){
        let key = this.setCallback();
        chrome.runtime.sendMessage({id: "remove_code", key: key, dataKey: dataKey, index: index}, (e)=>{});
    }

    attachTag(dataKey, tagName, callback){
        let key = this.setCallback(callback);
        chrome.runtime.sendMessage({id: "attachTag", datakey: dataKey, tagName: tagName, key: key}, e=>{});
    }

    removeTag(tagKey){
        let key = this.setCallback();
        chrome.runtime.sendMessage({id: "removeTag", tagKey: tagKey}, e=>{});
    }

    getTagsAll(callback){
        let key = this.setCallback(callback);
        chrome.runtime.sendMessage({id: "getTagsAll", key: key}, e=>{});
    }

    jump_link(item, tag){
        chrome.tabs.query({active: true, currentWindow: true}, tab=>{
            chrome.tabs.sendMessage(tab[0].id, {id: "jump_link", item: item, tag: tag }, (e)=>{});
        });
    }

    detachTag(dataKey, tagKey){
        let key = this.setCallback();
        chrome.runtime.sendMessage({id: "detachTag", datakey: dataKey, tagKey: tagKey}, e=>{});
    }

    findUsingTag(query, callback){
        let key = this.setCallback(callback);
        chrome.runtime.sendMessage({id: "findUsingTag", query: query, key: key}, (e)=>{});
    }

    find(query, callback){
        let key = this.setCallback(callback);
        chrome.runtime.sendMessage({id: "find", query: query, key: key}, (e)=>{});
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
