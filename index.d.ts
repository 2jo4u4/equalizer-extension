import type Browser from "webextension-polyfill";

declare global {
  const browser: typeof Browser;
  type NotifyType = keyof MsgToFormat;
  type ActionType = "save" | "delete" | "medialink" | "reset" | "favorite";

  interface MsgToFormat {
    initUI: {
      fliter: Filters;
      isAutoConnect: boolean;
    };
    open: null | undefined;
    connect: null | undefined;
    ctrl: { index: number; val: number };
    groupCtrl: number[];
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
  type FilterOption = Record<string, { i18nKey?: string; isCustom: boolean; filters: Filters }>;
  interface FilterParam {
    f: number;
    q: number;
    g: number;
  }
}
