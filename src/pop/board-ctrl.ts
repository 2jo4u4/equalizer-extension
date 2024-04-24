import type { MdSlider } from "@material/web/slider/slider";
import type { MdFilledTextField } from "@material/web/textfield/filled-text-field";

import {
  hzToTitle,
  sendMessageToCurrentTabs,
  Store,
  usefulFilfter,
} from "../util";
import {
  tabs_board_container,
  select_input,
  name_dialog,
} from "./bind.element";
import { MdIconButton } from "@material/web/iconbutton/icon-button";

const SliderArray: MdSlider[] = [];

(async function () {
  // -----
  const {
    mainEqaulizerSetting = "default",
    usefulEqaulizerSetting = usefulFilfter,
    customEqaulizerSetting = {},
  } = await Store.getAll();

  // -------
  const [
    save_filter_btn,
    reset_filter_btn,
    connect_filter_btn,
    lock_filter_btn,
    delete_filter_btn,
  ] = tabs_board_container.querySelectorAll("md-icon-button");
  const btnContainer = document.createElement("div");

  reset_filter_btn.addEventListener("click", function () {
    Store.getAll().then(
      ({
        usefulEqaulizerSetting = usefulFilfter,
        customEqaulizerSetting = {},
      }) => {
        const { filters } =
          usefulEqaulizerSetting[select_input.value] ||
          customEqaulizerSetting[select_input.value];

        filters.forEach((filter, index) => {
          sendMessageToCurrentTabs("ctrl", {
            index,
            val: filter.gain,
          });

          SliderArray[index].value = filter.gain;
        });
      }
    );
  });

  save_filter_btn.addEventListener("click", function () {
    name_dialog.show();
  });

  connect_filter_btn.addEventListener("click", function () {
    sendMessageToCurrentTabs("connect", null);
  });

  lock_filter_btn.addEventListener("click", function () {
    sendMessageToCurrentTabs("setting-defalut", select_input.value);
  });

  delete_filter_btn.addEventListener("click", async function () {
    sendMessageToCurrentTabs("store-delete-custom", select_input.value);
  });

  tabs_board_container.appendChild(btnContainer).append(name_dialog);
  tabs_board_container.append(select_input);
  // ---------
  const [dialog_cencel, dialog_comfirm] = name_dialog.querySelectorAll(
    ".footer > md-icon-button"
  ) as NodeListOf<MdIconButton>;

  dialog_cencel.addEventListener("click", function () {
    name_dialog.close();
  });
  dialog_comfirm.addEventListener("click", function () {
    const input = name_dialog.querySelector(
      "md-filled-text-field"
    ) as MdFilledTextField;
    if (input.value) {
      sendMessageToCurrentTabs("store-setting", input.value);
      input.value = "";
      name_dialog.close();
    }
  });

  // -------
  Object.keys(usefulEqaulizerSetting).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = key;
    option.dataset.isCustom = "0";
    select_input.append(option);
  });
  Object.keys(customEqaulizerSetting).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = key;
    option.dataset.isCustom = "1";
    select_input.append(option);
  });

  select_input.value = mainEqaulizerSetting;
  select_input.addEventListener("change", function () {
    Store.getAll().then(
      ({
        usefulEqaulizerSetting = usefulFilfter,
        customEqaulizerSetting = {},
      }) => {
        const obj = Object.assign(
          {},
          usefulEqaulizerSetting,
          customEqaulizerSetting
        );
        const array = obj[select_input.value];
        if (array) {
          SliderArray.forEach((el, index) => {
            el.value = array.filters[index].gain;
            sendMessageToCurrentTabs("ctrl", {
              index,
              val: array.filters[index].gain,
            });
          });
        }
      }
    );
  });

  // ---------
  const { filters } =
    usefulEqaulizerSetting[mainEqaulizerSetting] ||
    customEqaulizerSetting[mainEqaulizerSetting];

  filters.forEach((item, index) => {
    const slider = document.createElement("md-slider");
    slider.step = 0.5;
    slider.max = 12;
    slider.min = -12;
    slider.value = item.gain;
    slider.labeled = true;

    slider.addEventListener("input", function () {
      if (slider.value !== undefined) {
        sendMessageToCurrentTabs("ctrl", { index, val: slider.value });
      }
    });
    const labed = document.createElement("span");
    labed.innerText = hzToTitle(item.hz);
    const container = document.createElement("div");

    tabs_board_container.appendChild(container).append(slider, labed);
    SliderArray.push(slider);
  });

  sendMessageToCurrentTabs("open", null);
})();

async function rerenderSelect(name?: string) {
  select_input.querySelectorAll("option").forEach((el) => {
    if (el.dataset.isCustom === "1") {
      select_input.removeChild(el);
    }
  });
  const custom = (await Store.get("customEqaulizerSetting")) ?? {};
  Object.keys(custom).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = key;
    option.dataset.isCustom = "1";
    select_input.append(option);
  });
  if (name) {
    select_input.value = name;
  }
}

export { SliderArray, rerenderSelect };
