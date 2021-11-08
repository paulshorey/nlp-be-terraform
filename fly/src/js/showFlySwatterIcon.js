const showFlySwatterIcon = function (SHOW_FLYSWATTER_ICON) {
  let oldEl = document.getElementById("toggleFlySwatter");
  if (oldEl) {
    oldEl.parentNode.removeChild(oldEl);
  }
  let newEl = document.createElement("div");
  newEl.id = "toggleFlySwatter";
  console.log(
    "\n\n\nShow fly icon " +
      chrome.runtime.getURL(
        `images/icons/flyswatter-${!!SHOW_FLYSWATTER_ICON ? "on" : "off"}.svg`
      ) +
      "\n\n\n"
  );
  newEl.innerHTML = `
    <img src="${chrome.runtime.getURL(
      `images/icons/flyswatter-${!!SHOW_FLYSWATTER_ICON ? "on" : "off"}.svg`
    )}" height="12px" class="${
    !!!SHOW_FLYSWATTER_ICON ? "toggleFlySwatter-is-disabled" : ""
  }" />
  `;
  newEl.onclick = function () {
    chrome.runtime.sendMessage({
      action: "set",
      key: "SHOW_FLYSWATTER_ICON",
      value: !SHOW_FLYSWATTER_ICON,
    });
    if (DEBUG2) console.log("disabled onclick", !!SHOW_FLYSWATTER_ICON);
    window.location.reload();
    return false;
  };
  window.document.body.appendChild(newEl);
};
export default showFlySwatterIcon;
