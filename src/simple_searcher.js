
export default class simpleSearcher{
    constructor(){

    }

    find(find_list, query, keys){
        if( query === "" ) return [];
        query = query.replace(/ |　/g, " ");
        let words = query.split(" ");
        let wordCount = words.length;
        let hit_list = [];
        
        find_list.forEach( val=>{
            let targetStr = "";
            keys.forEach( key=>{ targetStr += val[key]; });
            if( !words.some( word=>!targetStr.includes(word)) ) hit_list.push( val );
        });
        return hit_list;
    }
}
