import { Store, alwaysExistFilter, defaluValue, VERSION, Equalizer, sendMessageToEuqalizer } from "../util";

async function reset() {
  return Promise.all([
    Store.set("mainEqaulizerSetting", defaluValue),
    Store.set("alwaysExistEqaulizerSetting", alwaysExistFilter),
    Store.set("customEqaulizerSetting", {}),
  ]);
}

let equalizer: Equalizer;

(async function initStore() {
  const res = await Store.get("checkDataStatus");
  if (res === undefined) {
    Store.set("checkDataStatus", { version: VERSION });
    await reset();
  } else if (res.version !== VERSION) {
    // 版更變更
    await reset();
  }

  // Initial Data
  const {
    mainEqaulizerSetting = defaluValue,
    alwaysExistEqaulizerSetting = alwaysExistFilter,
    customEqaulizerSetting = {},
  } = await Store.getAll();

  equalizer = new Equalizer();
  const { filters } = customEqaulizerSetting[mainEqaulizerSetting] ?? alwaysExistEqaulizerSetting[mainEqaulizerSetting];
  filters.forEach(filter => {
    equalizer.addToQueue(equalizer.audio.useFilter(filter));
  });

  connect();
  listener(true);
})();

function getCurrentState() {
  const filters: Filter[] = [];
  equalizer.queue.forEach(filter => {
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
        const filter = equalizer.queue.get((index + 1).toString());
        filter && (filter.gain.value = val);
        break;
      }
      case "groupCtrl": {
        const newVals = msg.data as MsgToFormat["groupCtrl"];
        newVals.forEach((val, index) => {
          const filter = equalizer.queue.get((index + 1).toString());
          filter && (filter.gain.value = val);
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
