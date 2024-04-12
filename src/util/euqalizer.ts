export class AudioContextWithMethod {
  audioCtx: AudioContext;
  constructor(contextOptions?: AudioContextOptions) {
    this.audioCtx = new AudioContext(contextOptions);
  }
  createBiquadFilter() {
    return this.audioCtx.createBiquadFilter();
  }
  allpass({ f, g, q }: FilterParam) {
    const filter = this.createBiquadFilter();
    filter.type = "allpass";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  bandpass({ f, g, q }: FilterParam) {
    const filter = this.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  highpass({ f, g, q }: FilterParam) {
    const filter = this.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  highshelf({ f, g, q }: FilterParam) {
    const filter = this.createBiquadFilter();
    filter.type = "highshelf";
    filter.frequency.value = f;
    filter.gain.value = g;
    return filter;
  }
  lowpass({ f, g, q }: FilterParam) {
    const filter = this.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  lowshelf({ f, g, q }: FilterParam) {
    const filter = this.createBiquadFilter();
    filter.type = "lowshelf";
    filter.frequency.value = f;
    filter.gain.value = g;
    return filter;
  }
  notch({ f, g, q }: FilterParam) {
    const filter = this.createBiquadFilter();
    filter.type = "notch";
    filter.frequency.value = f;
    filter.Q.value = q;
    return filter;
  }
  peaking({ f, g, q }: FilterParam) {
    const filter = this.createBiquadFilter();
    filter.type = "peaking";
    filter.frequency.value = f;
    filter.Q.value = q;
    filter.gain.value = g;
    return filter;
  }
}
export class Equalizer {
  private index: number;
  audio: AudioContextWithMethod;
  audioCtx: AudioContext;
  queue: Map<string, BiquadFilterNode>;
  media!: HTMLMediaElement;
  isStream: boolean;
  source!: MediaElementAudioSourceNode;
  constructor(el?: HTMLMediaElement) {
    this.index = 0;
    this.audio = new AudioContextWithMethod();
    this.audioCtx = this.audio.audioCtx;
    this.queue = new Map();
    el && (this.media = el);
    this.isStream = false;
  }
  addToQueue(filter: BiquadFilterNode) {
    this.index++;
    const id = this.index.toString();
    this.queue.set(id, filter);
    return this;
  }
  stream(el = this.media) {
    if (this.isStream) return;
    if (el) {
      this.media = el;
      this.source = this.audioCtx.createMediaElementSource(this.media);
      let last: MediaElementAudioSourceNode | BiquadFilterNode = this.source;
      this.queue.forEach((filter) => {
        last.connect(filter);
        last = filter;
      });
      last.connect(this.audioCtx.destination);
      this.isStream = true;
    }
  }
}
