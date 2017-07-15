"use strict mode"

export default class bmark_parser{
    
    constructor(){
        this._rules = {
            div: {
                rules: [ { method: this.keep_len, param: {length: 100}, conbination: "or" } ],
            },
            other: {
                rules: [ { method: this.keep_len, param: {length: 100}, conbination: "or" } ],
            }
        }
    }

    parse(selection_elem){
        if( this.chk_element(selection_elem) ){
            return selection_elem;
        }
        else{
            return this.parse(selection_elem.parentNode);
        }
    }

    chk_element(elem){
        let rule = this._rules[elem.tagName];
        if( !rule ) rule = this._rules.other;

        let is_valid = false;
        rule.rules.forEach( (val) => { 
            let buf_result = val.method.call(this, elem, val.param );
            if( (val.conbination === "or") && buf_result ){ is_valid = true; return; }
        });

        return is_valid;
    }

    //----------------------------------------------------------------------------
    //      Rules
    //----------------------------------------------------------------------------
    keep_len(elem, param){ return (elem.innerHTML.length > param.length) }

}
