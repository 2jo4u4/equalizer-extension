import type Browser from "webextension-polyfill";
import type { Slider } from "./src/pop/customTag";

declare global {
  class CustomSliderElement extends Slider {}
  const browser: typeof Browser;
  type NotifyType = keyof MsgToFormat;

  interface MsgToFormat {
    initUI: { fliter: Filter[]; isConnect: boolean };
    open: null | undefined;
    connect: null | undefined;
    ctrl: { index: number; val: number };
    debug: any;
    "store-setting": null | undefined;
    hiddenConnectBtn: null | undefined;
  }
  interface SendMsg {
    type: NotifyType;
    data: MsgToFormat[SendMsg["type"]];
  }
  interface Filter {
    hz: number;
    init: number;
    type: BiquadFilterType;
  }
  interface FilterParam {
    f: number;
    q: number;
    g: number;
  }
  //-----
}
