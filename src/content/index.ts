import { Store, ALWAYSEXIST, DEFALUTVALUE, VERSION, Equalizer, sendMessageToEuqalizer } from "../util";

async function reset() {
  return Promise.all([
    Store.set("mainOption", DEFALUTVALUE),
    Store.set("alwaysExist", ALWAYSEXIST),
    Store.set("customMap", new Map()),
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
    mainOption = DEFALUTVALUE,
    alwaysExist = ALWAYSEXIST,
    customMap = new Map() as FilterMaps,
  } = await Store.getAll();

  equalizer = new Equalizer();
  const obj = customMap.get(mainOption) || alwaysExist.get(mainOption);
  if (obj) {
    const { filters } = obj;
    filters.forEach(filter => {
      equalizer.addToQueue(equalizer.audio.useFilter(filter));
    });
  }

  connect();
  listener(true);
})();

function getCurrentState() {
  const filters: Filters = [];
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
          filters: getCurrentState(),
          isAutoConnect,
        });
        break;
      }
      case "connect": {
        connect();
        break;
      }
      case "ctrl": {
        const data = msg.data as MsgToFormat["ctrl"];
        data.forEach(({ index, val }) => {
          const filter = equalizer.queue.get(index.toString());
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
