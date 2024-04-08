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
  constructor(el, audioCtx) {
    this.audioCtx = audioCtx;
    this.media = el;
    this.queue = new Map();
    this.index = 1;
  }
  addToQueue(filter, id) {
    const indexstr = this.index.toString();
    this.queue.set(typeof id === "string" ? id : indexstr, [filter, indexstr]);
    this.index++;
    return this;
  }
  stream() {
    this.source = this.audioCtx.createMediaElementSource(this.media);
    let last = this.source;
    this.queue.forEach(([filter]) => {
      last.connect(filter);
      last = filter;
    });
    last.connect(this.audioCtx.destination);
  }
}
class EqualizerUIComponent {
  static dashboard() {
    const dashboard = document.createElement("div");
    dashboard.style.border = "1px #929292 solid";
    dashboard.style.margin = "8px";
    dashboard.style.padding = "8px";
    dashboard.style.borderRadius = "8px";
    dashboard.style.background = "#81adff3b";
    dashboard.style.width = "fit-content";
    dashboard.style.display = "flex";
    dashboard.style.gap = "10px";
    return dashboard;
  }
  static sliderInput() {
    const input = document.createElement("input");
    input.type = "range";
    input.style.writingMode = "vertical-lr";
    input.style.direction = "rtl";
    input.style.height = "180px";
    input.style.width = "32px";
    return input;
  }
  static sliderContiner() {
    const block = document.createElement("div");
    block.style.display = "flex";
    block.style.flexDirection = "column";
    block.style.alignItems = "center";
    block.style.width = "fit-content";
    return block;
  }
  constructor(el, contextOptions) {
    this.core = new AudioContextWithMethod(contextOptions);
    this.equalizer = new Equalizer(el, this.core.audioCtx);
    this.dashboardEl = EqualizerUIComponent.dashboard();
    this.sliderList = [];
    this.stream = this.equalizer.stream.bind(this.equalizer);
  }
  reset() {
    this.sliderList.forEach(({ input }) => {
      if (input.dataset.init) {
        input.value = input.dataset.init;
        input.dispatchEvent(
          new InputEvent("input", { data: input.dataset.init })
        );
      }
    });
  }
  addSilder(init, max, min, step, option) {
    const initStr = init.toString(),
      maxStr = max.toString(),
      minStr = min.toString(),
      stepStr = step.toString(),
      input = EqualizerUIComponent.sliderInput(),
      container = EqualizerUIComponent.sliderContiner();
    input.max = maxStr;
    input.min = minStr;
    input.step = stepStr;
    input.value = initStr;
    input.dataset.init = initStr;
    const { target, filter, addToDashBoard, fliterType, f, q, g } =
      Object.assign(
        {
          target: "gain",
          addToDashBoard: true,
          filter: undefined,
          fliterType: undefined,
          f: 350,
          q: 1,
          g: 0,
        },
        option
      );
    let targetFilter;
    if (filter !== undefined) {
      targetFilter = filter;
    } else if (fliterType !== undefined) {
      targetFilter = this.core[fliterType]({ f, q, g });
    }
    if (targetFilter) {
      input.addEventListener("input", function () {
        const newVal = parseFloat(this.value);
        targetFilter[target].value = newVal;
      });
      this.equalizer.addToQueue(targetFilter);
    }
    const titleText = document.createElement("span"),
      maxText = document.createElement("span"),
      minText = document.createElement("span");
    maxText.innerText = maxStr;
    minText.innerText = minStr;
    titleText.innerHTML = `${targetFilter.frequency.value} HZ`;
    titleText.style.marginBottom = "4px";
    container.append(titleText, maxText, input, minText);
    this.sliderList.push({ container, input });
    if (addToDashBoard) {
      this.dashboardEl.append(container);
    }
    return this;
  }
}

browser.runtime.onMessage.addListener(console.log);
