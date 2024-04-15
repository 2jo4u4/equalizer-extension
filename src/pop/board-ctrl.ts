import type { MdSlider } from "@material/web/slider/slider";

import { defFilter, hzToTitle, sendMessageToCurrentTabs, Store } from "../util";
import { EmitEvent } from "./customEvent";
import {
  connect_fliter_btn,
  reset_filter_btn,
  save_filter_btn,
  tabs_board_container,
} from "./bind.element";

const SliderArray: MdSlider[] = [];

(async function () {
  const array = (await Store.get("mainEqaulizerSetting")) ?? defFilter;
  const btnContainer = document.createElement("div");
  btnContainer.id = "btnContainer";

  reset_filter_btn.addEventListener("click", function () {
    SliderArray.forEach((el, index) => {
      sendMessageToCurrentTabs("ctrl", { index: index + 1, val: 0 });
      el.value = 0;
    });
  });

  save_filter_btn.addEventListener("click", function () {
    sendMessageToCurrentTabs("store-setting", null);
  });

  connect_fliter_btn.addEventListener("click", function () {
    sendMessageToCurrentTabs("connect", null);
  });

  tabs_board_container
    .appendChild(btnContainer)
    .append(save_filter_btn, reset_filter_btn, connect_fliter_btn);

  array.forEach((item, index) => {
    const slider = document.createElement("md-slider") as MdSlider;
    slider.step = 0.5;
    slider.max = 12;
    slider.min = -12;
    slider.value = item.init;
    slider.labeled = true;

    slider.addEventListener("input", function () {
      if (slider.value !== undefined) {
        EmitEvent.sliderChange.notify({
          ...item,
          index: index + 1,
          val: slider.value,
        });
      }
    });
    const labed = document.createElement("span");
    labed.innerText = hzToTitle(item.hz);
    const container = document.createElement("div");

    tabs_board_container.appendChild(container).append(slider, labed);
    SliderArray.push(slider);
  });
})();

export { SliderArray };
