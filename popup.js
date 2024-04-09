async function getCurrentTabs() {
  return await browser.tabs.query({ active: true, currentWindow: true });
}

/**
 * @param {"open"|"connect"|"ctrl"|"debug"} type
 * @param {any} data
 */
async function sendMessageToCurrentTabs(type, data) {
  getCurrentTabs().then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { type, data });
  });
}

/** @typedef {{id: string; hz: number; init: number; title: string; type: BiquadFilterType}} Filter */
/** @type {Filter[]} */
const initData = [
  { id: "f1", hz: 60, init: 0, type: "peaking", title: "60 HZ" },
  { id: "f2", hz: 230, init: 0, type: "peaking", title: "230 HZ" },
  { id: "f3", hz: 910, init: 0, type: "peaking", title: "910 HZ" },
  { id: "f4", hz: 4000, init: 0, type: "peaking", title: "4k HZ" },
  { id: "f5", hz: 14000, init: 0, type: "peaking", title: "14k HZ" },
];

/**
 * @param {CustomEvent<number>} event
 * @param {Filter} item
 */
function changeValue(event, item) {
  sendMessageToCurrentTabs("ctrl", { id: item.id, val: event.detail });
}

const dashboard = document.createElement("div");
dashboard.id = "dashboard";

const shortcutKey = document.createElement("div");
shortcutKey.id = "shortcut-key";

dashboard.append(shortcutKey);

const resetBtn = document.createElement("button");
resetBtn.innerText = "Reset";
resetBtn.onclick = function () {
  const sliderArray = document.querySelectorAll("app-slider");
  sliderArray.forEach((slider) => {
    slider.setValue(0);
    sendMessageToCurrentTabs("ctrl", { id: slider.id, val: 0 });
  });
};

const connectBtn = document.createElement("button");
connectBtn.innerText = "Connect Filter";
connectBtn.onclick = function () {
  sendMessageToCurrentTabs("connect");
};
shortcutKey.append(resetBtn, connectBtn);

const container = document.createElement("div");
container.id = "slider-container";

dashboard.append(container);

initData.forEach((item) => {
  const slider = document.createElement("app-slider");
  slider.setTitle(item.title);
  slider.setValue(item.init);
  slider.id = item.id;
  slider.addEventListener("sliderChange", (evt) => {
    changeValue(evt, item);
  });
  container.append(slider);
});

document.body.append(dashboard);

sendMessageToCurrentTabs("open", initData);

browser.runtime.onMessage.addListener(({ type, ...other }) => {
  /** @type {"initSlider"} */
  const action = type;
  switch (action) {
    case "initSlider": {
      /** @type {{id: string; val: number}[]} */
      const _data = other.data;
      const sliderArray = document.querySelectorAll("app-slider");
      sliderArray.forEach((slider, index) => {
        slider.setValue(_data[index].val);
      });
      break;
    }
    default:
      sendMessageToCurrentTabs("debug", other);
      break;
  }
});
