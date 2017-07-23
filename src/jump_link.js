
export default class JumpLink{
    static Jump(item, tag){
        chrome.storage.sync.set({tag: tag}, function(){});
        if( window.location.href !== item.url ){
            window.location.href = item.url;
        }
        else{
            this.JumpToElementAfterLoad();
        }
    }

    static JumpToElementAfterLoad(){
        chrome.storage.sync.get( null, (param) => {
            if( param === null ) return;
            this.JumpElement(param.tag);
        });
    }

    static JumpElement(taginfo){
        this._JumpElementById(taginfo) || this._JumpElementByText(taginfo);
    }

    static _JumpElementByText(taginfo){
        var elemList = Array.prototype.slice.call(document.getElementsByTagName(taginfo.tagName));
        var toElem = null;
        elemList.forEach( elem=>{
            if( taginfo.text === elem.innerText ){
                toElem = elem;
            }
        });
        if( !toElem ) return false;
        this._ScrollToElement(toElem);
        return true;
    }

    static _JumpElementById(taginfo){
        if( taginfo.id === "" ) return false;
        let jumpItem = document.getElementById(taginfo.id);
        if( !jumpItem ) return false;
        this._ScrollToElement(jumpItem);
        return true;
    }

    static _ScrollToElement(elem){
        let TopPosition = elem.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo(0, TopPosition);
    }
}
