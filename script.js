
var curpos = {x: 0, y: 0};


function find_element_fromtext(text){

}


function __savefile(fs){
    console.log("Opened file sysetm: " + fs.name);
}

function __error_savefile(){
    switch(e.code){
        case FileError.QUOTA_EXCEEDED_ERR:

            break;
            
        case FileError.NOT_FOUND_ERR:

            break;
        case FileError.SECURITY_ERR:

            break;
        case FileError.INVALID_MODIFICATION_ERR:

            break;
        case FileError.INVALID_STATE_ERR:

            break;
        default:
    };
}

function savefile(text){
    window.requestFileSystem( window.PERISTENT, 1024, __savefile, __error_savefile );
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


