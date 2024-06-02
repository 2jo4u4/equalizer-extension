export const defaluValue = "default";
export const alwaysExistFilter: FilterOption = {
  [defaluValue]: {
    i18nKey: "defaultEuqalize",
    isCustom: false,
    filters: [
      { hz: 60, gain: 0, q: 0.7, type: "peaking" },
      { hz: 230, gain: 0, q: 0.7, type: "peaking" },
      { hz: 910, gain: 0, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 0, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 0, q: 0.7, type: "peaking" },
    ],
  },
  "low-enhance": {
    i18nKey: "lowEnhance",
    isCustom: false,
    filters: [
      { hz: 60, gain: 12, q: 0.7, type: "peaking" },
      { hz: 230, gain: 12, q: 0.7, type: "peaking" },
      { hz: 910, gain: 10, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 8, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 8, q: 0.7, type: "peaking" },
    ],
  },
  "height-enhance": {
    i18nKey: "heightEnhance",
    isCustom: false,
    filters: [
      { hz: 60, gain: 8, q: 0.7, type: "peaking" },
      { hz: 230, gain: 8, q: 0.7, type: "peaking" },
      { hz: 910, gain: 10, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 12, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 12, q: 0.7, type: "peaking" },
    ],
  },
  "volume-enhance": {
    i18nKey: "volumeEnhance",
    isCustom: false,
    filters: [
      { hz: 60, gain: 6, q: 0.7, type: "peaking" },
      { hz: 230, gain: 12, q: 0.7, type: "peaking" },
      { hz: 910, gain: 12, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 8, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 6, q: 0.7, type: "peaking" },
    ],
  },
  "low-reduce": {
    i18nKey: "lowReduce",
    isCustom: false,
    filters: [
      { hz: 60, gain: -8, q: 0.7, type: "peaking" },
      { hz: 230, gain: -6, q: 0.7, type: "peaking" },
      { hz: 910, gain: 0, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 0, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 0, q: 0.7, type: "peaking" },
    ],
  },
  "height-reduce": {
    i18nKey: "heightReduce",
    isCustom: false,
    filters: [
      { hz: 60, gain: 0, q: 0.7, type: "peaking" },
      { hz: 230, gain: 0, q: 0.7, type: "peaking" },
      { hz: 910, gain: 0, q: 0.7, type: "peaking" },
      { hz: 4000, gain: -6, q: 0.7, type: "peaking" },
      { hz: 14000, gain: -8, q: 0.7, type: "peaking" },
    ],
  },
};
