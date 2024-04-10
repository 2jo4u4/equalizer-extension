import type Browser from "webextension-polyfill";
import type { Slider } from "./src/customTag";

declare global {
  class CustomSliderElement extends Slider {}
  let browser: typeof Browser;
  type NotifyType = "open" | "connect" | "ctrl" | "debug" | "initUI";
  interface MsgToContent {}
  interface MsgToPop {}
  interface Filter {
    id: string;
    hz: number;
    init: number;
    title: string;
    type: BiquadFilterType;
  }
  interface FilterParam {
    f: number;
    q: number;
    g: number;
  }
}
