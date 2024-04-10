import { Equalizer } from "./euqalizer";

let isMount = false;
let equalizer!: Equalizer;

browser.runtime.onMessage.addListener((...msg) => {
  const [command, tabs] = msg;

  /** @type {"open"|"connect"|"ctrl"|"debug"} */
  const action = command.type;

  switch (action) {
    case "open":
      // 打開擴充的html
      // TODO:: 檢查是否已經生成
      // 若已生成則覆用，並通知更換樣式
      if (isMount) {
        // 已生成，通知更換樣式
        const data: { id: string; val: number }[] = [];
        equalizer.queue.forEach((filter, id) => {
          data.push({ id, val: filter.gain.value });
        });
        browser.runtime.sendMessage({ type: "initSlider", data });
      } else {
        equalizer = new Equalizer();
        isMount = true;
        const data = command.data as {
          id: string;
          hz: number;
          init: number;
          type: BiquadFilterType;
        }[];
        data.forEach(({ id, hz, init, type }) => {
          const filter = equalizer.audio[type]({ f: hz, q: 0.7, g: init });
          equalizer.addToQueue(filter, id);
        });
      }
      break;
    case "connect":
      if (isMount) {
        const video = findMedia();
        video && equalizer.stream(video);
      }
      break;
    case "ctrl":
      if (equalizer) {
        const { id, val } = command.data;
        const filter = equalizer.queue.get(id);
        filter.gain.value = val;
      }
      break;
    case "debug":
      console.log("debug", command.data);
      break;
  }
});

function findMedia() {
  return document.querySelector("video");
}
