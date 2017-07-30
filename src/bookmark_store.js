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
            var objectStore = this._db.createObjectStore("bookmarks", {keyPath: "id", autoIncrement: true });
            objectStore.createIndex("text_for_dupcheck", "text_for_dupcheck", { unique: true });
        };

    }

    getTextForDuplicateCheck(data){
        return data.title + data.header_tag_text + data.url;
    }

    setBookmarkData(data){
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        let textForFinding = data.content+ " " + data.header_tag_text + " " + data.title;
        let textForDuplicateCheck = this.getTextForDuplicateCheck(data);
        let addData = { contents: [data.content],
            url: data.url,
            title: data.title,
            header_tag_text: data.header_tag_text,
            tags: data.tags,
            text_for_finding: textForFinding.toLowerCase(),
            text_for_dupcheck: textForDuplicateCheck
        };
        var request = objectStore.add(addData);
        request.onsuccess = e => { console.log(e); this.__keyList.unshift(e.target.result); };
        request.onerror = e => { console.log(e); };
        this._dataVersion++;
        this.bookmarkCount++;
    }

    updateBookmarkData(data){
        let dupchk_text = this.getTextForDuplicateCheck(data);
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        let index = objectStore.index("text_for_dupcheck");
        return new Promise((resolve, reject) => {
            let get_item = index.get(dupchk_text);
            get_item.onsuccess = e => {
                let updateData = e.target.result;
                if( !updateData ){ reject(e); return; }
                updateData.contents.push(data.content);
                var requestUpdate = objectStore.put(updateData);
                requestUpdate.onerror = e => { reject(e) };
                requestUpdate.onsuccess = e => { resolve(e) };
            }
            get_item.onerror = e => { reject(e); }
        });
        this.dataVersion++;
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

        objectStore.openCursor(IDBKeyRange.bound(offset, length), "prev").onsuccess = function(e){
            var cursor = e.target.result;
            if( cursor ){
                let ret_val = cursor.value;
                ret_val.key = cursor.key;
                data.push( ret_val );
                readcount++;
                if( (len !== 0) && (len === readcount ) ){
                    callback(data);
                }
                else{
                    cursor.continue();
                }
            }
            else{
                callback(data);
            }
        }

    }

    removeBookmark(key){
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        objectStore.delete(key);
    }

    removeCode(key, index){
        let transaction = this._db.transaction(["bookmarks"], "readwrite");
        let objectStore = transaction.objectStore("bookmarks");
        objectStore.get(key).onsuccess = e=>{ 
            let updateData = e.target.result;
            if( !updateData ){ throw "Update data is nothing"; return; }
            updateData.contents.splice(index, 1);
            var requestUpdate = objectStore.put(updateData);
            requestUpdate.onerror = e => { throw "Update was failed" };
            requestUpdate.onsuccess = e => { return Promise.resolve("hoge"); };
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
