import "./content.scss";
import * as Types from "./types";
import killPopupsAndAds from "./js/killPopupsAndAds"
import showFlySwatterIcon from "./js/showFlySwatterIcon"

console.log(`\n\n\nContent.ts file ran\n\n\n`);
const DEBUG1 = false; // which stuff to hide/show
const DEBUG2 = false; // localStorage/indexDB
const DEBUG3 = false; // buttons inside cookie banner
const DEBUG4 = false; // buttons inside cookie banner - advanced
const body = document.getElementsByTagName("body");

chrome.runtime.sendMessage({ action: "get", key: "SHOW_FLYSWATTER_ICON" });
chrome.runtime.sendMessage({ action: "get", key: "KILL_POPUPS_AND_ADS" });

chrome.runtime.onMessage.addListener((message) => {
  console.log(`\n\n\nContent.ts: message received: ${JSON.stringify(message)}`); 
  switch (message.key) {
    case "SHOW_FLYSWATTER_ICON":
        showFlySwatterIcon(message.value);
    break;
    case "KILL_POPUPS_AND_ADS":
      if (message.value) {
        setTimeout(killPopupsAndAds, 1000)
        setTimeout(killPopupsAndAds, 2000)
        setTimeout(killPopupsAndAds, 4000)
      }
    break;
    default:
    break;
  }
});

