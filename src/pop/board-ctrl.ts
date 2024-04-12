import { defFilter, hzToTitle, Store } from "../util";
import { EmitEvent } from "./customEvent";
import type { MdSlider } from "@material/web/slider/slider";
import { boardPanelID } from "./ids";

const SliderArray: MdSlider[] = [];

(async function () {
  const board = document.querySelector(`#${boardPanelID}`) as HTMLDivElement;
  const array = (await Store.get("mainEqaulizerSetting")) ?? defFilter;

  array.forEach((item, index) => {
    const slider = document.createElement("md-slider") as MdSlider;
    slider.step = 0.5;
    slider.max = 12;
    slider.min = -12;
    slider.value = item.init;
    slider.labeled = true;

    slider.addEventListener("input", function () {
      if (slider.value !== undefined) {
        EmitEvent.sliderChange.notify({ ...item, index, val: slider.value });
      }
    });
    const labed = document.createElement("span");
    labed.innerText = hzToTitle(item.hz);
    const container = document.createElement("div");

    board.appendChild(container).append(slider, labed);
    SliderArray.push(slider);
  });
})();

export { SliderArray };
