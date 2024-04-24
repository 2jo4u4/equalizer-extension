import type Browser from "webextension-polyfill";

declare global {
  const browser: typeof Browser;
  type NotifyType = keyof MsgToFormat;

  interface MsgToFormat {
    initUI: {
      fliter: Filters;
      isAutoConnect: boolean;
    };
    rerender: {
      module: "filter-select-add" | "filter-select-delete";
      name: string;
    };
    open: null | undefined;
    connect: null | undefined;
    ctrl: { index: number; val: number };
    debug: any;
    "store-setting": string;
    "store-delete-custom": string;
    "setting-defalut": string;
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
  type FilterOption = Record<string, { isCustom: boolean; filters: Filters }>;
  interface FilterParam {
    f: number;
    q: number;
    g: number;
  }
}
