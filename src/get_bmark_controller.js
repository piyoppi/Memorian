"use strict mode"


export default class popup_controller{

    constructor(){
        this._callback_buffer = {};

        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                console.log(request);
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

    get_bookmarks_request(callback){
        let key = this.keygen();
        this._callback_buffer[ key ] = callback;
        chrome.runtime.sendMessage({id: "get_bookmarks", key: key}, (e)=>{});
    }

    delete_item(key){
        chrome.runtime.sendMessage({id: "remove_item", key: key}, (e)=>{});
    }

}
