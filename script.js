
var curpos = {x: 0, y: 0};


function find_element_fromtext(text){

}

function find_element_fromcurpos(){
    var setpos_x = window.pageXOffset + curpos.x;
    var setpos_y = window.pageYOffset + curpos.y;
    var obj = document.elementFromPoint(curpos.x, curpos.y);
    return obj;
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


