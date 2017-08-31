
export default class JumpLink{

    constructor(){
    }

    Jump(item, tag){
        chrome.storage.local.set({'tag': tag}, ()=>{
            if( window.location.href !== item.url ){
                window.location.href = item.url;
            }
            else{
                this.JumpToElementAfterLoad();
            }
        });
    }

    JumpToElementAfterLoad(){
        chrome.storage.local.get( 'tag', (param) => {
            if( param.tag === null ) return;
            this.JumpElement(param.tag);
            chrome.storage.local.set({'tag': null}, ()=>{});
        });
    }

    _JumpElement(taginfo, cntRetryCount = 0, jumpLocation = window.location.href){
        if( !(this._JumpElementById(taginfo) || this._JumpElementByText(taginfo)) ){
            if( (++cntRetryCount < 20) && (jumpLocation === window.location.href) ){
                setTimeout( ()=>{ this._JumpElement(taginfo, cntRetryCount, jumpLocation) }, 500 );                 
            }
        }
    }

    JumpElement(taginfo){
        this._JumpElement(taginfo);
    }

    _JumpElementByText(taginfo){
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

    _JumpElementById(taginfo){
        if( taginfo.id === "" ) return false;
        let jumpItem = document.getElementById(taginfo.id);
        if( !jumpItem ) return false;
        this._ScrollToElement(jumpItem);
        return true;
    }

    _ScrollToElement(elem){
        let TopPosition = elem.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo(0, TopPosition);
    }
}
