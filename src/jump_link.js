
export default class JumpLink{

    constructor(){
        this.checkTagDictionary = {
            h6: ['h5', 'h4', 'h3', 'h2', 'h1'],
            h5: ['h4', 'h3', 'h2', 'h1'],
            h4: ['h3', 'h2', 'h1'],
            h3: ['h2', 'h1'],
            h2: ['h1'],
        }
    }

    Jump(item, tag){
        chrome.storage.local.set({'tag': tag, 'jumpBookmark': item}, ()=>{
            if( window.location.href !== item.url ){
                window.location.href = item.url.replace( /#.*/, '');
            }
            else{
                this.JumpToElementAfterLoad();
            }
        });
    }

    JumpToElementAfterLoad(){
        chrome.storage.local.get( ['tag', 'jumpBookmark'], (param) => {
            if( param.tag === null || param.jumpBookmark === null ) return;
            chrome.storage.local.set({'tag': null, 'jumpBookmark': null}, ()=>{});
            this.JumpElement(param.tag, param.jumpBookmark);
        });
    }

    _JumpElement(taginfo, item, cntRetryCount = 0, jumpLocation = window.location.href){
        if( !(this._JumpElementById(taginfo, item) || this._JumpElementByText(taginfo, item)) ){
            if( (++cntRetryCount < 10) && (jumpLocation === window.location.href) ){
                setTimeout( ()=>{ this._JumpElement(taginfo, cntRetryCount, jumpLocation) }, 800 );                 
            }
        }
    }

    JumpElement(taginfo, item){
        this._JumpElement(taginfo, item);
    }

    _checkValidToElement(checkElement, tagInfo, item){
        let chkTagName = tagInfo.tagName.toLowerCase();
        if( !(chkTagName in this.checkTagDictionary) ) return true;
        let tagItemTop = checkElement.getBoundingClientRect().top;
        return this.checkTagDictionary[chkTagName].every( parentTagName => {
            if( !(parentTagName in item.captions) ) return true;
            let chkElements = Array.prototype.slice.call(document.getElementsByTagName(parentTagName));
            let minDist = 0, nearItem = null;
            chkElements.forEach( chkElement => {
                let chkDist = tagItemTop - chkElement.getBoundingClientRect().top;
                if( ((chkDist > 0) && (chkDist < minDist)) || (minDist === 0) ){
                    nearItem = chkElement;
                    minDist = chkDist;
                }
            });
            return nearItem.innerText.includes(item.captions[parentTagName].text);
        });
    }


    _JumpElementByText(taginfo, item){
        var elemList = Array.prototype.slice.call(document.getElementsByTagName(taginfo.tagName));
        var toElem = null;
        elemList.some( elem => {
            if( taginfo.text === elem.innerText ){
                toElem = elem;
                return this._checkValidToElement(toElem, taginfo, item);
            }
            return false;
        });
        if( !toElem ) return false;
        this._ScrollToElement(toElem);
        return true;
    }

    _JumpElementById(taginfo, item){
        if( taginfo.id === "" ) return false;
        let jumpItem = document.getElementById(taginfo.id);
        if( !jumpItem ) return false;
        if( !this._checkValidToElement(jumpItem, taginfo, item) ) return false;
        this._ScrollToElement(jumpItem);
        return true;
    }

    _ScrollToElement(elem){
        let TopPosition = elem.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo(0, TopPosition);
    }
}
