"use strict mode"


export default class popup_controller{

    constructor(){
        this._callback_buffer = {};

        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                if( request.key in this._callback_buffer ){
                    this._callback_buffer[request.key](request.data);
                    delete this._callback_buffer[request.key];
                }
            }
        );
    }

    keygen(){
        return String(Math.random() * 100000);
    }

    get_bookmarks_request(offset, len, callback){
        let key = this.keygen();
        this._callback_buffer[ key ] = callback;
        chrome.runtime.sendMessage({id: "get_bookmarks", offset: offset, length: len, key: key}, (e)=>{});
    }

    removeItem(key){
        chrome.runtime.sendMessage({id: "remove_item", key: key}, (e)=>{});
    }

    removeCode(key, index){
        chrome.runtime.sendMessage({id: "remove_code", key: key, index: index}, (e)=>{});
    }

    attachTag(dataKey, tagName, callback){
        let key = this.keygen();
        this._callback_buffer[ key ] = callback;
        chrome.runtime.sendMessage({id: "attachTag", datakey: dataKey, tagName: tagName, key: key}, e=>{});
    }

    getTagsAll(callback){
        let key = this.keygen();
        this._callback_buffer[ key ] = callback;
        chrome.runtime.sendMessage({id: "getTagsAll", key: key}, e=>{});
    }

    jump_link(item, tag){
        chrome.tabs.query({active: true, currentWindow: true}, tab=>{
            chrome.tabs.sendMessage(tab[0].id, {id: "jump_link", item: item, tag: tag }, (e)=>{});
        });
    }

    detachTag(dataKey, tagKey){
        chrome.runtime.sendMessage({id: "detachTag", datakey: dataKey, tagName: tagKey}, e=>{});
    }

    find(query, callback){
        let key = this.keygen();
        this._callback_buffer[ key ] = callback;
        chrome.runtime.sendMessage({id: "find", query: query, key: key}, (e)=>{});
    }

}
