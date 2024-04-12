import { defFilter, hzToTitle, sendMessageToCurrentTabs, Store } from "../util";
import { EmitEvent } from "./customEvent";
import type { MdSlider } from "@material/web/slider/slider";
import type { MdFilledButton } from "@material/web/button/filled-button";
import type { MdOutlinedButton } from "@material/web/button/outlined-button";
import type { MdTextButton } from "@material/web/button/text-button";
import { boardPanelID, manualConnectMedia } from "./ids";

const SliderArray: MdSlider[] = [];

(async function () {
  const board = document.querySelector(`#${boardPanelID}`) as HTMLDivElement;
  const array = (await Store.get("mainEqaulizerSetting")) ?? defFilter;
  const btnContainer = document.createElement("div");
  btnContainer.id = "btnContainer";
  const resetBtn = document.createElement("md-filled-button") as MdFilledButton;
  resetBtn.innerText = "重置";
  resetBtn.addEventListener("click", function () {
    SliderArray.forEach((el, index) => {
      sendMessageToCurrentTabs("ctrl", { index: index + 1, val: 0 });
      el.value = 0;
    });
  });

  const saveBtn = document.createElement(
    "md-outlined-button"
  ) as MdOutlinedButton;
  saveBtn.innerText = "保存";
  saveBtn.addEventListener("click", function () {
    sendMessageToCurrentTabs("store-setting", null);
  });

  const connectBtn = document.createElement("md-text-button") as MdTextButton;
  connectBtn.id = manualConnectMedia;
  connectBtn.innerText = "掛載";
  connectBtn.addEventListener("click", function () {
    sendMessageToCurrentTabs("connect", null);
  });

  board.appendChild(btnContainer).append(saveBtn, resetBtn, connectBtn);
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

    board.appendChild(container).append(slider, labed);
    SliderArray.push(slider);
  });
})();

export { SliderArray };
