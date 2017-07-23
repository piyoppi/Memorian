
export default class simpleSearcher{
    constructor(){

    }

    find(find_list, query, keys){
        console.log(query);
        query = query.replace(/ |　/g, " ");
        let wordCount = (query.split(" ") || []).length;
        let convQuery = query.replace(/\|/g, "\|").replace(/ /g, "|");
        let re = new RegExp(convQuery);
        let hit_list = [];
        
        find_list.forEach( val=>{
            if( keys.some( key=>re.test( val[key] ) ) ){
                hit_list.push( val );
            }
        });
        return hit_list;
    }
}
