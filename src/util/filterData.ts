export const usefulFilfter: FilterOption = {
  default: {
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
    isCustom: false,
    filters: [
      { hz: 60, gain: 8, q: 0.7, type: "peaking" },
      { hz: 230, gain: 8, q: 0.7, type: "peaking" },
      { hz: 910, gain: 10, q: 0.7, type: "peaking" },
      { hz: 4000, gain: 12, q: 0.7, type: "peaking" },
      { hz: 14000, gain: 12, q: 0.7, type: "peaking" },
    ],
  },
};
