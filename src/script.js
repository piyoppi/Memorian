import selection from './selection.js'
import parser from './bmark_parser.js'

var selectbox = new selection(document.body);
var bmark_parser = new parser(document.body);

var curpos = {x: 0, y: 0};

function select_area(){
}

function find_element_fromtext(text){

}

function find_element_fromcurpos(){
    var setpos_x = window.pageXOffset + curpos.x;
    var setpos_y = window.pageYOffset + curpos.y;
    let obj = document.elementFromPoint(curpos.x, curpos.y);
    let retobj = bmark_parser.parse( obj );
    let rettags = bmark_parser.get_information_tagsearch( obj );
    console.log( retobj );
    console.log( rettags );
    return retobj;
}

function handler_mousemove(e){
    curpos.x = e.clientX;
    curpos.y = e.clientY;
}

document.addEventListener("contextmenu", handler_mousemove, false);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if( request.id = "element_memo" ){
          console.log( find_element_fromcurpos().innerHTML );
          sendResponse({selection_elem: find_element_fromcurpos().innerHTML});
      }
      else{
          sendResponse({selection_text: window.getSelection()});
      }
  }
);


