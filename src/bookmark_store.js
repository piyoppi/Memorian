import simpleSearcher from './simple_searcher.js'

export default class bookmarkStore{
    constructor(param){
        this.dbVersion = param.version || 1;
        this._dataVersion = 0;
        this._db = null;
        this.InitializeDatabase();

        this.__allDatas = { version: -1, data: null};
        this.__findResults = {query: "", version: -1, data: null};
        this.__keyList = [];

    }

    getKeyList(){
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        objectStore.openCursor().onsuccess = e => {
            let cursor = e.target.result;
            if( cursor ){
                this.__keyList.push( cursor.key );
                cursor.continue();
            }
            else{
                this.__keyList.sort( (a, b)=>b-a );
            }
        }
    }

    getBookmarkCount(){
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        objectStore.count().onsuccess = (e)=>{
            this.bookmarkCount = e.target.result;
        };
    }

    InitializeDatabase(){
        var request = window.indexedDB.open("Bookmarkers", this.dbVersion);
        request.onsuccess = (e) => {
            this._db = e.target.result;
            this.getBookmarkCount();
            this.getKeyList();
        }
        request.onerror = () => {};
        request.onupgradeneeded = (e) => { 
            this._db = e.target.result;
            //Bookmarks 
            var objectStore = this._db.createObjectStore("bookmarks", {keyPath: "id", autoIncrement: true });
            objectStore.createIndex("text_for_dupcheck", "text_for_dupcheck", { unique: true });
            //Tags
            var tagStore = this._db.createObjectStore("tags", {keyPath: "id", autoIncrement: true});
            tagStore.createIndex("tagName", "tagName", { unique: true });
        };

    }

    getTextForDuplicateCheck(data){
        return data.title + data.header_tag_text + data.url;
    }

    genTextForFinding(data){
        return (data.content+ " " + data.header_tag_text + " " + data.title).toLowerCase().replace(/\r|\n|\r\n/g, "");
    }

    detachTag(key, tagName){
        this.getTag(tagName).then( e => {
            let transaction = this._db.transaction(["tags"], "readwrite");
            let objectStore = transaction.objectStore("tags");
            let keyPosition = e.contentIDs.indexOf(key);
            if( keyPosition != 0 ) return;
            if( e.contentIDs.length === 1 ){
                this.removeTag(tagName);
            }
            else{
                e.contentIDs.splice(keyPosition, 1);
            }
            let request = objectStore.put(e);
            request.onerror = e => { };
            request.onsuccess = e => { };
        });
    }

    removeTag(tagName){
        let transaction = this._db.transaction(["tags"], "readwrite");
        let objectStore = transaction.objectStore("tags");
        objectStore.delete(tagName);
    }

    getOrCreateTag(tagName){
        return this.getTag(tagName).then( e => {
            if( e ){
                return Promise.resolve(e);
            }
            else{
                return this.addTag(tagName).then( e => {console.log("getorgetorgetor"); return Promise.resolve(e);} );
            }
        } )
    }

    attachTagFromDataKey(datakey, tagName){
        return this.addBookmarkKeyIntoTag(datakey, tagName).then( tag => 
            this.getBookmark(datakey).then( data => {
                this.addTagKeyIntoBookmark(data, tag.id);
                return Promise.resolve(tag);
            })
        );
    }

    detachTagFromDataKey(dataKey, tagKey){
        this.getBookmark.then( bookmark => {
            let findTagIndex = bookmark.tagIds.indexOf(tagKey);
            if( findTagIndex >= 0 ){
                bookmark.tagIds.splice(findTagIndex, 1);
                return this.updateBookmarkData(bookmark);
            }
            else{
                throw "UndefinedTagIndexException";
            }
        })
        .then( e => this.getTagFromKey(tagKey) )
        .then( tagData => {
            let findDataIndex = tagData.contentIDs.indexOf(dataKey);
            if( findDataIndex >= 0 ){
                tagData.contentIDs.splice(findDataIndex, 1);
                this.updateTag(tagData);
            }
        });
    }

    //attachTag(data, tagName){
    //    this.addBookmarkKeyIntoTag.then( tag => {
    //        this.addTagKeyIntoBookmark(data, tag.id);
    //    });
    //}

    addTagKeyIntoBookmark(data, tagkey){
        data.tagIds.push(tagkey);
        this.updateBookmarkData(data).then( e=>{} );
    }

    addBookmarkKeyIntoTag(datakey, tagName){
        return this.getOrCreateTag(tagName).then( tag => {
            tag.contentIDs.push(datakey);
            return new Promise( (resolve, reject) => {
                let transaction = this._db.transaction(["tags"], "readwrite");
                let objectStore = transaction.objectStore("tags");
                let request = objectStore.put(tag);
                request.onsuccess = e => resolve(tag);
                request.onerror = e => reject(e);
            });
        });
    }

    getTag(tagName){
        let transaction = this._db.transaction(["tags"], "readwrite");
        let objectStore = transaction.objectStore("tags");
        let index = objectStore.index("tagName");
        return new Promise( (resolve, reject) => {
            let request = index.get(tagName);
            request.onsuccess = e => resolve(e.target.result);
            request.onerror = e => reject(e);
        });
    }

    updateTag(tag){
        return new Promise( (resolve, reject) => {
            let transaction = this._db.transaction(["tags"], "readwrite");
            let objectStore = transaction.objectStore("tags");
            var requestUpdate = objectStore.put(tag);
            requestUpdate.onerror = e => reject(e);
            requestUpdate.onsuccess = e => resolve(e);
        });
    }

    getTagFromKey(key){
        let transaction = this._db.transaction(["tags"], "readwrite");
        let objectStore = transaction.objectStore("tags");
        return new Promise( (resolve, reject) => {
            let request = objectStore.get(key);
            request.onsuccess = e => resolve(e.target.result);
            request.onerror = e => reject(e);
        });
    }

    getTagsAll(){
        return new Promise( (resolve, reject) => {
            let response = [];
            let transaction = this._db.transaction(["tags"], "readwrite");
            let objectStore = transaction.objectStore("tags");
            objectStore.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if( cursor ){
                    response.push(cursor.value);
                    cursor.continue();
                }
                else{
                    resolve(response);
                }
            }
        });
    }

    addTag(tagName){
        return new Promise( (resolve, reject) => {
            let addData = {
                tagName: tagName,
                contentIDs: []
            };
            let transaction = this._db.transaction(["tags"], "readwrite");
            let objectStore = transaction.objectStore("tags");
            let request = objectStore.add(addData);
            request.onsuccess = e => this.getTag(tagName).then( e => resolve(e) );
            request.onerror = e => reject(e);
        });
    }

    setBookmarkData(data){
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        let textForFinding = this.genTextForFinding(data);
        let textForDuplicateCheck = this.getTextForDuplicateCheck(data);
        let addData = {
            contents: [data.content],
            url: data.url,
            title: data.title,
            header_tag_text: data.header_tag_text,
            captions: data.captions,
            text_for_finding: textForFinding + "\n",
            text_for_dupcheck: textForDuplicateCheck,
            tagIds: []
        };
        let request = objectStore.add(addData);
        request.onsuccess = e => { this.__keyList.unshift(e.target.result); };
        request.onerror = e => {};
        this._dataVersion++;
        this.bookmarkCount++;
    }

    updateBookmarkData(data){
        return new Promise( (resolve, reject) => {
            let transaction = this._db.transaction(["bookmarks"], "readwrite");
            let objectStore = transaction.objectStore("bookmarks");
            var requestUpdate = objectStore.put(data);
            requestUpdate.onerror = e => reject(e);
            requestUpdate.onsuccess = e => resolve(e);
        });
    }

    addContentIntoBookmarkData(data){
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        let index = objectStore.index("text_for_dupcheck");
        return new Promise((resolve, reject) => {
            let dupchk_text = this.getTextForDuplicateCheck(data);
            let get_item = index.get(dupchk_text);
            get_item.onsuccess = e => {
                let updateData = e.target.result;
                if( !updateData ){ reject(e); return; }
                updateData.contents.push(data.content);
                updateData.text_for_finding += this.genTextForFinding(data) + "\n";
                var requestUpdate = objectStore.put(updateData);
                requestUpdate.onerror = e => reject(e);
                requestUpdate.onsuccess = e => resolve(e);
            }
            get_item.onerror = e => reject(e);
        });
        this._dataVersion++;
    }

    getBookmark(key){
        return new Promise( (resolve, reject) => {
            let transaction = this._db.transaction(["bookmarks"], "readwrite");
            let objectStore = transaction.objectStore("bookmarks");
            let response = objectStore.get(key);
            response.onsuccess = e => this.attachTagDataToBookmarkData(e.target.result).then( data => resolve(data) );
            response.onerror = e => reject(e);
        });
    }

    attachTagDataToBookmarkDatas(bookmarks){
        let promises = [];
        bookmarks.forEach( bookmark => promises.push(this.attachTagDataToBookmarkData(bookmark)) );
        console.log("hoeghoge2");
        return Promise.all( promises ).then( results => Promise.resolve( results ) );
    }

    attachTagDataToBookmarkData(bookmark){
        let promises = [];
        bookmark.tags = [];
        bookmark.tagIds.forEach( tagId => promises.push(this.getTagFromKey(tagId)) );
        return Promise.all( promises ).then( results=>{
            results.forEach( result => {
                bookmark.tags.push( result );
            });
            return Promise.resolve(bookmark);
        });
    }

    getBookmarks(ofs, len, callback){
        if( ofs >= this.__keyList.length ){
            callback([]);
            return;    
        }

        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        let data = [];
        let readcount = 0;
        let keyListIdxOffset = ofs + len;
        if( this.__keyList.length <= keyListIdxOffset ) keyListIdxOffset = this.__keyList.length-1;
        let offset = this.__keyList[keyListIdxOffset];
        let length = this.__keyList[ofs];

        objectStore.openCursor(IDBKeyRange.bound(offset, length), "prev").onsuccess = e => {
            var cursor = e.target.result;
            if( cursor ){
                let ret_val = cursor.value;
                ret_val.key = cursor.key;
                data.push( ret_val );
                readcount++;
                if( (len !== 0) && (len === readcount ) ){
                    this.attachTagDataToBookmarkDatas(data).then( data => callback(data) );
                }
                else{
                    cursor.continue();
                }
            }
            else{
                this.attachTagDataToBookmarkDatas(data).then( data => callback(data) );
            }
        }

    }

    removeBookmark(key){
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        let keylistIdx = this.__keyList.indexOf(key);
        if( keylistIdx >= 0 ) this.__keyList.splice(keylistIdx, 1);
        objectStore.delete(key);
    }

    removeCode(key, index){
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        objectStore.get(key).onsuccess = e=>{ 
            let updateData = e.target.result;
            if( !updateData ){ throw "Update data is nothing"; return; }
            updateData.contents.splice(index, 1);

            let arrTextforFinding = updateData.text_for_finding.split("\n");
            arrTextforFinding.splice(index, 1);
            updateData.text_for_finding = arrTextforFinding.join("\n");

            let requestUpdate = objectStore.put(updateData);
            requestUpdate.onerror = e => { throw "Update was failed" };
            requestUpdate.onsuccess = e => { return Promise.resolve("hoge"); };
            this._dataVersion++;
        };

    }

    find(query, callback){
        if( !query || query.query === "" ){
            this.getBookmarks(query.offset, query.length, callback);
            return;
        }
        let searcher = new simpleSearcher();
        if( (query.query !== this.__findResults.query) || (this._dataVersion !== this.__findResults.version ) ){
            this.getAllBookmarks(e=>{
                let data = searcher.find(e, query.query, ["text_for_finding"]);
                this.__findResults = { query: query.query, version: this._dataVersion, data: data };
                callback( data.slice(query.offset, query.length ) );
            });
        }
        else{
            callback( this.__findResults.data.slice(query.offset, query.offset + query.length ) );
        }
    }

    getAllBookmarks(callback){
        if( this.__allDatas.version !== this._dataVersion ){
            this.getBookmarks(0, this.bookmarkCount, (data)=>{
                this.__allDatas = { version: this._dataVersion, data: data };
                callback(data)
            });
        }
        else{
            callback(this.__allDatas.data);
        }
    }
}
