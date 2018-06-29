chrome.runtime.onInstalled.addListener(function (details) {
    chrome.storage.local.set({ key: '-' });
});