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
    let block_elem = bmark_parser.parse( obj );
    let additional_info = bmark_parser.get_information_tagsearch( block_elem );
    console.log( block_elem );
    console.log( additional_info );
    return {
                block: block_elem.innerHTML,
                additional_info: additional_info,
                title: document.title,
                url: window.location.href
            };
}

function handler_mousemove(e){
    curpos.x = e.clientX;
    curpos.y = e.clientY;
}

document.addEventListener("contextmenu", handler_mousemove, false);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if( request.id = "element_memo" ){
          sendResponse(find_element_fromcurpos());
      }
      else{
          sendResponse();
      }
  }
);


