"use strict mode"


export default class popup_controller{

    static get_bookmarks_request(offset, len, callback){
        chrome.runtime.sendMessage({id: "get_bookmarks", offset: offset, length: len}, e=>callback(e.data));
    }

    static getBookmarksAll(callback){
        chrome.runtime.sendMessage({id: "getBookmarksAll"}, e=>callback(e.data));
    }

    static insertBookmarks(data, callback){
        chrome.runtime.sendMessage({id: "insertBookmarks", data: data}, e=>callback(e));
    }

    static removeItem(dataKey, callback){
        chrome.runtime.sendMessage({id: "remove_item", dataKey: dataKey}, e=>callback());
    }

    static removeCode(dataKey, index, callback){
        chrome.runtime.sendMessage({id: "remove_code", dataKey: dataKey, index: index}, e=>callback());
    }

    static attachTag(dataKey, tagName, callback){
        chrome.runtime.sendMessage({id: "attachTag", datakey: dataKey, tagName: tagName}, e=>callback(e.data));
    }

    static removeTag(tagKey, callback){
        chrome.runtime.sendMessage({id: "removeTag", tagKey: tagKey}, e=>callback(e.data));
    }

    static getTagsAll(callback){
        chrome.runtime.sendMessage({id: "getTagsAll"}, e=>callback(e.data));
    }

    static jump_link(item, tag){
        chrome.tabs.query({active: true, currentWindow: true}, tab=>{
            chrome.tabs.sendMessage(tab[0].id, {id: "jump_link", item: item, tag: tag }, (e)=>{});
        });
        chrome.runtime.sendMessage({id: "jump_link", item: item, tag: tag }, (e)=>{});
    }

    static detachTag(dataKey, tagKey, callback){
        chrome.runtime.sendMessage({id: "detachTag", datakey: dataKey, tagKey: tagKey}, e=>callback());
    }

    static findUsingTag(query, callback){
        chrome.runtime.sendMessage({id: "findUsingTag", query: query}, e=>callback(e.data));
    }

    static find(query, callback){
        chrome.runtime.sendMessage({id: "find", query: query}, e=>callback(e.data));
    }

    static findKeywordOrTag(query, callback){
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
