import * as Types from './types';

const saveMessage = (message:Types.message) => {

  // save to local storage
  chrome.storage.local.set(message);
  
  // save to browser extension popup
  chrome.runtime.sendMessage(message);

  // save on every active tab
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message);
      }
    });
  });
};

/*
 * State
*/
const options:Types.options = {
  SHOW_FLYSWATTER_ICON: true,
  KILL_POPUPS_AND_ADS: true
}
for (let key in options) {
  chrome.storage.local.get(key, (result) => {
    options[key] = result[key] || options[key];
  });
}

chrome.runtime.onMessage.addListener((message:Types.message) => {
  switch (message.action) {
    case "get":
      saveMessage({ key: message.key, value: options[message.key] });
      break;
    case "set":
      options[message.key] = message.value;
      saveMessage(message);
      break;
    default:
      break;
  }
});

