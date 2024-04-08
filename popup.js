const RESET = "RESET";
(function () {
  const sliderInputEl = {
    "60HZ": getSlider("60hz"),
    "230HZ": getSlider("230hz"),
    "910HZ": getSlider("910hz"),
    "4000HZ": getSlider("4khz"),
    "14000HZ": getSlider("14khz"),
  };
  document.querySelector(`#${RESET}`).onclick = reset;
  sliderInputEl["60HZ"].oninput = sliderChange;
})();

async function getCurrentTabs() {
  return await browser.tabs.query({ active: true, currentWindow: true });
}
/**
 * @param {string} id
 * @returns {HTMLInputElement | null}
 */
function getSlider(id) {
  try {
    return document.querySelector(`#${id} input`);
  } catch (e) {
    return null;
  }
}

function sliderChange() {}
function reset() {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "beastify",
      tabs,
    });
  });
}
