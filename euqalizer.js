class AudioContextWithMethod {
  constructor(contextOptions) {
    this.audioCtx = new AudioContext(contextOptions);
  }
  createBiquadFilter() {
    return this.audioCtx.createBiquadFilter();
  }
  allpass({ f, g, q }) {
    const filter = this.createBiquadFilter();
    filter.type = "allpass";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  bandpass({ f, g, q }) {
    const filter = this.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  highpass({ f, g, q }) {
    const filter = this.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  highshelf({ f, g, q }) {
    const filter = this.createBiquadFilter();
    filter.type = "highshelf";
    filter.frequency.value = f;
    filter.gain.value = g;
    return filter;
  }
  lowpass({ f, g, q }) {
    const filter = this.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  lowshelf({ f, g, q }) {
    const filter = this.createBiquadFilter();
    filter.type = "lowshelf";
    filter.frequency.value = f;
    filter.gain.value = g;
    return filter;
  }
  notch({ f, g, q }) {
    const filter = this.createBiquadFilter();
    filter.type = "notch";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  peaking({ f, g, q }) {
    const filter = this.createBiquadFilter();
    filter.type = "peaking";
    filter.frequency.value = f;
    filter.Q.value = q;
    filter.gain.value = g;
    return filter;
  }
}
class Equalizer {
  constructor(el) {
    this.audio = new AudioContextWithMethod();
    this.audioCtx = this.audio.audioCtx;
    this.queue = new Map();
    this.media = el;
    this.isStream = false;
  }
  addToQueue(filter, id) {
    this.queue.set(id, filter);
    return this;
  }
  stream(el = this.media) {
    if (this.isStream) return;
    if (el) {
      this.media = el;
      this.source = this.audioCtx.createMediaElementSource(this.media);
      let last = this.source;
      this.queue.forEach((filter) => {
        last.connect(filter);
        last = filter;
      });
      last.connect(this.audioCtx.destination);
      this.isStream = true;
    }
  }
}

let isMount = false;
let equalizer = null;

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
        const data = [];
        equalizer.queue.forEach((filter, id) => {
          data.push({ id, val: filter.gain.value });
        });
        browser.runtime.sendMessage({ type: "initSlider", data });
      } else {
        equalizer = new Equalizer();
        isMount = true;
        command.data.forEach(({ id, hz, init, type }) => {
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
