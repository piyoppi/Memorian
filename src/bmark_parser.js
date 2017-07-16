"use strict mode"

export default class bmark_parser{
    
    constructor(){
        this._selection_rules = {
            div: {
                rules: [ { method: this.keep_len, param: {length: 100}, conbination: "or" } ],
            },
            other: {
                rules: [ { method: this.keep_len, param: {length: 100}, conbination: "or" } ],
            }
        }

        this._element_rules = [
            {elem: ["h1"], method: this.is_near_element, params: null},
            {elem: ["h2"], method: this.is_near_element, params: null},
            {elem: ["h3"], method: this.is_near_element, params: null},
            {elem: ["h4"], method: this.is_near_element, params: null},
            {elem: ["h5"], method: this.is_near_element, params: null},
            {elem: ["h6"], method: this.is_near_element, params: null},
        ];
        this._element_checklist = [];
    }

    parse(selection_elem){
        return this.get_selection_element(selection_elem);
    }

    //----------------------------------------------------------------------------
    //      Find tags
    //----------------------------------------------------------------------------
    get_information_tagsearch(selection_elem){
        this._init_chk_element();
        this._chk_element(selection_elem);
        return this._element_rules;
    }

    _init_chk_element(){
        this._element_rules.forEach( (rule) => {
            this._element_checklist.push(rule.elem);
            rule.buffers = {};
            rule.elements=[];
        });
    }

    _chk_findelements_rule( selection_elem, chk_elem, rule ){
        rule.method.call(this, selection_elem, chk_elem, rule);
    }

    _chk_element(selection_elem){
        this._element_rules.forEach( (rule) => {
            rule.elem.forEach( ( tagstr) => {
                let tagList = document.getElementsByTagName(tagstr);
                for(let i=0; i<tagList.length; i++){
                    let chk_elem = tagList[i];
                    this._chk_findelements_rule( selection_elem, chk_elem, rule);
                }
            });
        });
        return false;
    }

    //----------------------------------------------------------------------------
    //      Get selection element
    //----------------------------------------------------------------------------

    get_selection_element(selection_elem){
        if( this._chk_selection_rules(selection_elem) ){
            return selection_elem;
        }
        else{
            return this.parse(selection_elem.parentNode);
        }
    }

    _chk_selection_rules(elem){
        let rule = this._selection_rules[elem.tagName];
        if( !rule ) rule = this._selection_rules.other;

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

    is_near_element(selection_elem, chk_elem, param){ 
        let bRect_selectionelem = selection_elem.getBoundingClientRect();
        let bRect_chk_elem = chk_elem.getBoundingClientRect();
        let diff_distance = bRect_selectionelem.top - bRect_chk_elem.top;
        if( diff_distance < 0 ) return;
        if( bRect_chk_elem.width === 0 ) return;
        if( bRect_chk_elem.height === 0 ) return;
        if( !param.buffers.dist ){
            param.elements.push( chk_elem );
            param.buffers.dist = diff_distance;
            console.log(chk_elem.tagName + "," + param.buffers.dist );
        }
        else if( param.buffers.dist > diff_distance ){
            param.elements[0] = chk_elem;    
            param.buffers.dist = diff_distance;
        }
    }

}
