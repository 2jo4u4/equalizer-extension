import { Equalizer, Store, defFilter, sendMessageToEuqalizer } from "../util";

let equalizer: Equalizer;

(async function () {
  // Initial Data
  equalizer = new Equalizer();
  const { mainEqaulizerSetting = defFilter, autoConnectMedia = 1 } =
    await Store.getAll();
  mainEqaulizerSetting.forEach(({ hz, init, type }) => {
    const filter = equalizer.audio[type]({ f: hz, q: 0.7, g: init });
    equalizer.addToQueue(filter);
  });

  const boo = autoConnectMedia === 1;
  if (boo) {
    connect();
  }
  listener(boo);
})();

function getCurrentState() {
  const filters: Filter[] = [];
  equalizer.queue.forEach((filter) => {
    filters.push({
      hz: filter.frequency.value,
      init: filter.gain.value,
      type: filter.type,
    });
  });
  console.log(filters);
  return filters;
}

function listener(isAutoConnect: boolean) {
  browser.runtime.onMessage.addListener((msg: SendMsg, tabs) => {
    switch (msg.type) {
      case "open": {
        sendMessageToEuqalizer("initUI", {
          fliter: getCurrentState(),
          isConnect: equalizer.isStream,
          isAutoConnect,
        });
        break;
      }
      case "connect": {
        connect();
        break;
      }
      case "ctrl": {
        const { index, val } = msg.data as MsgToFormat["ctrl"];
        console.log({ index, val });
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

function connect() {
  const video = findMedia();
  if (video) {
    equalizer.stream(video);
    sendMessageToEuqalizer("hiddenConnectBtn", null);
  }
}

function findMedia() {
  return document.querySelector("video");
}
