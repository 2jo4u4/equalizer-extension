import { Equalizer, Store, sendMessageToEuqalizer } from "../util";

let equalizer: Equalizer;

(async function () {
  // Initial Data
  equalizer = new Equalizer();
  const filterData = await Store.get("mainEqaulizerSetting");
  filterData.forEach(({ hz, init, type }) => {
    const filter = equalizer.audio[type]({ f: hz, q: 0.7, g: init });
    equalizer.addToQueue(filter);
  });
  listener();
})();

function getCurrentState() {
  const filters: Filter[] = [];
  equalizer.queue.forEach((filter, id) => {
    filters.push({
      hz: filter.frequency.value,
      init: filter.gain.value,
      type: filter.type,
    });
  });
  return filters;
}

function listener() {
  browser.runtime.onMessage.addListener((msg: SendMsg, tabs) => {
    switch (msg.type) {
      case "open": {
        sendMessageToEuqalizer("initUI", {
          fliter: getCurrentState(),
          isConnect: equalizer.isStream,
        });
        break;
      }
      case "connect": {
        const video = findMedia();
        if (video) {
          equalizer.stream(video);
          sendMessageToEuqalizer("hiddenConnectBtn", null);
        }
        break;
      }
      case "ctrl": {
        const { index, val } = msg.data as MsgToFormat["ctrl"];
        const filter = equalizer.queue.get(index.toString());
        filter && (filter.gain.value = val);
        break;
      }
      case "store-setting": {
        Store.set("mainEqaulizerSetting", getCurrentState());
        break;
      }
      default:
      case "debug": {
        console.log("debug", msg);
        break;
      }
    }
  });
}

function findMedia() {
  return document.querySelector("video");
}
