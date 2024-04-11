import { Equalizer } from "../util/euqalizer";
import { defFilter } from "../util/filterData";
import { sendMessageToEuqalizer, StorageCtrl } from '../util/tool'

let equalizer: Equalizer;

(async function () {
  // Initial Data
  equalizer = new Equalizer()
  const filterData = await StorageCtrl.get().then(result => result["eqaulizer-setting"] || defFilter)
  filterData.forEach(({ id, hz, init, type }) => {
    const filter = equalizer.audio[type]({ f: hz, q: 0.7, g: init });
    equalizer.addToQueue(filter, id);
  });
  listener()
}());

function getCurrentState() {
  const filters: Filter[] = []
  equalizer.queue.forEach((filter, id) => {
    filters.push({
      id: id,
      hz: filter.frequency.value,
      init: filter.gain.value,
      type: filter.type
    })
  })
  return filters
}

function listener() {
  browser.runtime.onMessage.addListener((msg: SendMsg, tabs) => {
    switch (msg.type) {
      case "open": {
        sendMessageToEuqalizer('initUI', { fliter: getCurrentState(), isConnect: equalizer.isStream })
        break;
      }
      case "connect": {
        const video = findMedia();
        if (video) {
          equalizer.stream(video);
          sendMessageToEuqalizer('hiddenConnectBtn', null)
        }
        break;
      }
      case "ctrl": {
        const { id, val } = msg.data as MsgToFormat['ctrl']
        const filter = equalizer.queue.get(id);
        filter && (filter.gain.value = val)
        break;
      }
      case 'store-setting': {
        StorageCtrl.set(getCurrentState())
        break
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
