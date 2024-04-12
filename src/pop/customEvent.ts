enum CustomType {
  滑桿調整 = "sliderChange",
}

type SliderChangeType = Filter & { index: number; val: number };

export class EmitEvent {
  static sliderChange = {
    notify(detail: SliderChangeType) {
      document.body.dispatchEvent(
        new CustomEvent(CustomType.滑桿調整, { detail })
      );
    },
    handle(callback: (data: SliderChangeType) => void) {
      document.body.addEventListener(CustomType.滑桿調整, function (event) {
        callback((event as CustomEvent<SliderChangeType>).detail);
      });
    },
  };
}
