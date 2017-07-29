"use strict mode"

export default class bmark_parser{
    
    constructor(){
        this._selection_rules = {
            div: {rules: [ { method: this.keep_len, param: {length: 20}, conbination: "or" } ],},
            code: {rules: [ { method: this.keep_len, param: {length: 0}, conbination: "or" } ],},
            pre: {rules: [ { method: this.keep_len, param: {length: 0}, conbination: "or" } ],},
            figure: {rules: [ { method: this.keep_len, param: {length: 0}, conbination: "or" } ],},
            table: {rules: [ { method: this.keep_len, param: {length: 0}, conbination: "or" } ],},
            other: {rules: [ { method: this.keep_len, param: {length: 70}, conbination: "or" } ],}
        }

        this._element_rules = [
            {elem: "h1", methods: [this.is_parentnode_has_selection_elems, this.is_near_element], params: null},
            {elem: "h2", methods: [this.is_parentnode_has_selection_elems, this.is_near_element], params: null},
            {elem: "h3", methods: [this.is_parentnode_has_selection_elems, this.is_near_element], params: null},
            {elem: "h4", methods: [this.is_parentnode_has_selection_elems, this.is_near_element], params: null},
            {elem: "h5", methods: [this.is_parentnode_has_selection_elems, this.is_near_element], params: null},
            {elem: "h6", methods: [this.is_parentnode_has_selection_elems, this.is_near_element], params: null},
        ];

        this._element_relation_rules = [
            {elem: "h2", compareTagName: ["h3", "h4", "h5", "h6"], howto_select_elem: this.selectfirstElement, methods: [this.isPositionLower]},
            {elem: "h3", compareTagName: ["h4", "h5", "h6"],       howto_select_elem: this.selectfirstElement, methods: [this.isPositionLower]},
            {elem: "h4", compareTagName: ["h5", "h6"],             howto_select_elem: this.selectfirstElement, methods: [this.isPositionLower]},
            {elem: "h5", compareTagName: ["h6"],                   howto_select_elem: this.selectfirstElement, methods: [this.isPositionLower]},
        ]
    }


    //----------------------------------------------------------------------------
    //      Find tags
    //----------------------------------------------------------------------------
    get_information_tagsearch(selection_elem){
        this._init_chk_element();
        this._chk_element(selection_elem);
        this._chk_relation_rules();
        return this._element_rules;
    }

    _init_chk_element(){
        this._element_rules.forEach( (rule) => {
            this._clear_chk_element(rule);
        });
    }

    _clear_chk_element(rule){
        rule.buffers = {};
        rule.elements=[];
    }

    _chk_findelements_rule( selection_elem, chk_elems, rule ){
        rule.elements = chk_elems;
        rule.methods.forEach( method=>{
            method.call(this, selection_elem, rule);
        });
    }

    _chk_element(selection_elem){
        this._element_rules.forEach( (rule) => {
            let tagList = Array.prototype.slice.call(document.getElementsByTagName(rule.elem));
            this._chk_findelements_rule(selection_elem, tagList, rule);
        });
        return false;
    }

    _FindRuleFromTagName(list, tagName){ return list.find( (item, index, array)=>item.elem === tagName ) || null; }

    _chk_relation_rules(){
        this._element_relation_rules.forEach( rule=>{ this._chk_relation_rule(rule); } );
    }

    _chk_relation_rule( rule ){
        rule.methods.forEach( method=>{
            let element_rule = this._FindRuleFromTagName( this._element_rules, rule.elem);
            if( !element_rule ) return;
            let chk_elem = rule.howto_select_elem.call(this, element_rule.elements);
            if( !chk_elem ) return;

            rule.compareTagName.forEach( compareTagName=>{
                let compare_rule = this._FindRuleFromTagName(this._element_rules, compareTagName);
                if( !compare_rule ) return;
                let compare_elems = compare_rule.elements;

                for( let i=0; i<compare_elems.length; i++ ){
                    let compare_elem = compare_elems[i];
                    if( !method.call(this, chk_elem, compare_elem) ){
                        compare_elems.splice(i, 1);
                        i--;
                    }
                }
            });
        });
    }

    //----------------------------------------------------------------------------
    //      Get selection element
    //----------------------------------------------------------------------------

    parse(selection_elem){
        console.log(selection_elem);
        return this.get_selection_element(selection_elem);
    }

    get_selection_element(selection_elem){
        if( this._chk_selection_rules(selection_elem) ){
            return selection_elem;
        }
        else{
            return this.get_selection_element(selection_elem.parentNode);
        }
    }

    _chk_selection_rules(elem){
        let rule = this._selection_rules[elem.tagName.toLowerCase()];
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
    keep_len(elem, param){ return (elem.innerText.length >= param.length) }

    _splice_array(indexes, arr){
        indexes.sort((a,b)=>a-b);
        for( let i=indexes.length-1; i>=0; i-- ){
            arr.splice(i, 1);
        }
    }

    is_parentnode_has_selection_elems(selection_elem, rule){
        rule.elements.forEach( (chk_elem, index)=>{
            rule.elements = this.is_parentnode_has_selection_elem(selection_elem, rule);
        });
    }

    is_parentnode_has_selection_elem(chk_elem, rule){
        if( chk_elem.parentNode.tagName.toLowerCase() === "body" ) return [];
        let nodelist = chk_elem.parentNode.getElementsByTagName(rule.elem);
        if( nodelist.length === 0 ){
            return this.is_parentnode_has_selection_elem(chk_elem.parentNode, rule)
        }
        return Array.prototype.slice.call(nodelist);
    }

    is_near_element(selection_elem, rule){ 
        let minInfo = null;
        rule.elements.forEach( chk_elem=>{
            let bRect_selectionelem = selection_elem.getBoundingClientRect();
            let bRect_chk_elem = chk_elem.getBoundingClientRect();
            let diff_distance = bRect_selectionelem.top - bRect_chk_elem.top;
            if( diff_distance < 0 ) return;
            if( bRect_chk_elem.width === 0 ) return;
            if( bRect_chk_elem.height === 0 ) return;
            if( (!minInfo) || (minInfo.dist > diff_distance) ){
                minInfo = {dist: diff_distance, elem: chk_elem}
            }
        });
        if( minInfo ){
            rule.elements = [minInfo.elem];
        }
        else{
            rule.elements = [];
        }
    }

    isPositionLower(selection_elem, chk_elem){ return selection_elem.getBoundingClientRect().top < chk_elem.getBoundingClientRect().top; }

    selectfirstElement(elements){ return elements.length !== 0 ? elements[0] : null; }
}
