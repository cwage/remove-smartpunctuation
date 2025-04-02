// Service worker setup
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['changequotes.js']
    });
  } catch (err) {
    console.error('Failed to execute script:', err);
  }
});

// Show action button for all supported pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url?.startsWith('http')) {
    chrome.action.enable(tabId);
  } else {
    chrome.action.disable(tabId);
  }
});
