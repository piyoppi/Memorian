
function contextMenu_Click(info, tab){
    chrome.tabs.sendMessage(tab.id, {hoge: "text_memo"}, function(response) {
        //alert(response.selection_text);
    });
}

function mnu_ElementMemo_click(info, tab){
    chrome.tabs.sendMessage(tab.id, {id: "element_memo"}, function(response) {
        //alert(response.selection_elem);
    });
}



chrome.contextMenus.create({
    title: "この部分を切り抜く",
    contexts: ["selection"],
    onclick: contextMenu_Click
});

chrome.contextMenus.create({
    title: "この部分を切り抜く",
    onclick: mnu_ElementMemo_click
});

