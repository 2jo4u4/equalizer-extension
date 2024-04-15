import { Equalizer, Store, defFilter, sendMessageToEuqalizer } from "../util";

let equalizer: Equalizer;

(async function () {
  // Initial Data
  equalizer = new Equalizer();
  const { mainEqaulizerSetting = defFilter, autoConnectMedia = 1 } =
    await Store.getAll();
  mainEqaulizerSetting.forEach(({ hz, q, gain, type }) => {
    const filter = equalizer.audio[type]({ f: hz, q: q, g: gain });
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
      gain: filter.gain.value,
      type: filter.type,
      q: filter.Q.value,
    });
  });
  return filters;
}

function listener(isAutoConnect: boolean) {
  browser.runtime.onMessage.addListener((msg: SendMsg, tabs) => {
    switch (msg.type) {
      case "open": {
        sendMessageToEuqalizer("initUI", {
          fliter: getCurrentState(),
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
        const filter = equalizer.queue.get(index.toString());
        filter && (filter.gain.value = val);
        break;
      }
      case "store-setting": {
        const { isMain, name } = msg.data as MsgToFormat["store-setting"];
        const filters = getCurrentState();
        if (isMain) {
          Store.set("mainEqaulizerSetting", filters);
        } else {
          const type = "customEqaulizerSetting";
          Store.get(type).then((res = {}) => {
            Store.set(type, {
              [name]: { isCustom: true, filters },
              ...res,
            });
          });
        }
        break;
      }
      case "store-delete-custom": {
        const name = msg.data as MsgToFormat["store-delete-custom"];
        Store.getAll().then(({ customEqaulizerSetting }) => {
          if (customEqaulizerSetting && customEqaulizerSetting[name]) {
            delete customEqaulizerSetting[name];
            Store.set("customEqaulizerSetting", customEqaulizerSetting);

            sendMessageToEuqalizer("rerender", { module: "filter-select" });
          }
        });
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
  if (video && !equalizer.isStream) {
    equalizer.stream(video);
  }
}

function findMedia() {
  return document.querySelector("video");
}
