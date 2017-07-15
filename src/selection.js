"use strict mode"

export default class select_ui{

    constructor(watching_element){
        this._watch_elem = watching_element;
        this._reg_mousedown_eventlistener();
        this._reg_mousemove_eventlistener();
        this._reg_mouseup_eventlistener();

        /* Select box */
        this._selbox = document.createElement("div");
        this._selbox.style.position = "absolute";
        this._selbox.style.borderStyle = "solid";
        this._selbox.style.borderWidth = "1px";
        this._selbox.style.zindex = "100";
        this._watch_elem.appendChild(this._selbox);

        this._selpos_start = {x: 0, y: 0};
        this._selpos_end   = {x: 0, y: 0};
        this._rectangle = {pos1: null, pos2: null, width: 0, height: 0};
        this._is_start_selecting = false;
        this._is_start_enable = false;
    }

    _reg_mousedown_eventlistener(){ this._watch_elem.addEventListener("mousedown", (e) => {this._handler_mousedown(e)}, false); }
    _reg_mousemove_eventlistener(){ this._watch_elem.addEventListener("mousemove", (e) => {this._handler_mousemove(e)}, false); }
    _reg_mouseup_eventlistener(){ this._watch_elem.addEventListener("mouseup", (e) => {this._handler_mouseup(e)}, false); }

    _hide_selbox(){
        this._selbox.style.display = "none";
    }
    _show_selbox(){
        this._selbox.style.display = "";
    }

    _set_rect_info(setpos1, setpos2){
        let pos1 = {x: 0, y:0};
        let pos2 = {x: 0, y:0};
        if( setpos1.x > setpos2.x ){
            pos1.x = setpos2.x;
            pos2.x = setpos1.x;
        }
        else{ 
            pos1.x = setpos1.x;
            pos2.x = setpos2.x;
        }
        if( setpos1.y > setpos2.y ){
            pos1.y = setpos2.y;
            pos2.y = setpos1.y;
        }
        else{ 
            pos1.y = setpos1.y;
            pos2.y = setpos2.y;
        }
        return { pos1: pos1, pos2: pos2, width: pos2.x-pos1.x, height: pos2.y-pos1.y };
    }

    start_select(pos){
        if( !this._is_start_enable  ) return;
        this._is_start_selecting = true;
        this._selpos_start = { x: pos.x, y: pos.y };
        this._selbox.style.left = pos.x + "px";
        this._selbox.style.top  = pos.y + "px";
        this._watch_elem.style.userSelect = "none";
        this._show_selbox();
    }

    end_select(pos){
        this._selpos_end = { x: pos.x, y: pos.y };
        this._rectangle = this._set_rect_info( this._selpos_start, this._selpos_end );
        this._hide_selbox();
        this._is_start_selecting = false;
        this._watch_elem.style.userSelect = "";
    }

    box_sizechange(pos){
        let rectinfo = this._set_rect_info(this._selpos_start, pos);
        this._selbox.style.width = (rectinfo.width) + "px";
        this._selbox.style.height = (rectinfo.height) + "px";
        this._selbox.style.left = (rectinfo.pos1.x) + "px";
        this._selbox.style.top = (rectinfo.pos1.y) + "px";
    }

    _get_curpos(e){
        return {x: e.clientX + window.pageXOffset, y: e.clientY + window.pageYOffset};
    }

    _handler_mousemove(e){
        if( this._is_start_selecting ){ this.box_sizechange(this._get_curpos(e)); }
    }

    _handler_mousedown(e){
        this.start_select(this._get_curpos(e));
    }

    _handler_mouseup(e){
        if( this._is_start_selecting ){ this.end_select(this._get_curpos(e)); }
    }

}
