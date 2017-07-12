
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      alert( request.hoge );
      sendResponse({title: document.title});
  }
);
