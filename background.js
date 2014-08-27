function onTabEvent(tabId) {
  chrome.tabs.get(tabId, function(tab) {
      chrome.pageAction.show(tab.id);
  });
}

function onPageActionClick(tab) {
  chrome.tabs.executeScript(tab.id, {'file': 'changequotes.js'});
}

chrome.tabs.onUpdated.addListener(onTabEvent);
chrome.tabs.onActiveChanged.addListener(onTabEvent);
chrome.pageAction.onClicked.addListener(onPageActionClick);
