import type Browser from "webextension-polyfill";

declare global {
  const browser: typeof Browser;
  type NotifyType = keyof MsgToFormat;
  type ActionType = "save" | "delete" | "medialink" | "reset" | "favorite";

  interface MsgToFormat {
    initUI: { filters: Filters; isAutoConnect: boolean };
    open: null | undefined;
    connect: null | undefined;
    ctrl: { index: number; val: number }[];
    debug: any;
  }
  interface SendMsg {
    type: NotifyType;
    data: MsgToFormat[SendMsg["type"]];
  }
  interface Filter {
    hz: number;
    gain: number;
    q: number;
    type: BiquadFilterType;
  }
  type Filters = Filter[];
  type FilterObject = { i18nKey?: string; filters: Filters };
  type FilterMaps = Map<string, FilterObject>;
  interface FilterParam {
    f: number;
    q: number;
    g: number;
  }
}
