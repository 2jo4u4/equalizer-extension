import type { MdSlider } from "@material/web/slider/slider";
import type { MdFilledTextField } from "@material/web/textfield/filled-text-field";

import {
  defFilter,
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
    mainEqaulizerSetting = defFilter,
    usefulEqaulizerSetting = usefulFilfter,
    customEqaulizerSetting = {},
  } = await Store.getAll();

  // -------
  const [
    save_filter_btn,
    reset_filter_btn,
    connect_fliter_btn,
    delete_filter_btn,
  ] = tabs_board_container.querySelectorAll("md-icon-button");
  const btnContainer = document.createElement("div");
  btnContainer.id = "btnContainer";

  reset_filter_btn.addEventListener("click", function () {
    Store.getAll().then(
      ({
        usefulEqaulizerSetting = usefulFilfter,
        customEqaulizerSetting = {},
      }) => {
        let array: Filters = [];
        if (select_input.value === "mainEqaulizerSetting") {
        }
        switch (select_input.value) {
          case "default":
            array = defFilter;
            break;
          default:
            const { filters } =
              usefulEqaulizerSetting[select_input.value] ||
              customEqaulizerSetting[select_input.value];
            array = filters;
            break;
        }

        array.forEach((filter, index) => {
          sendMessageToCurrentTabs("ctrl", {
            index: index + 1,
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

  connect_fliter_btn.addEventListener("click", function () {
    sendMessageToCurrentTabs("connect", null);
  });

  delete_filter_btn.addEventListener("click", function () {
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
      sendMessageToCurrentTabs("store-setting", {
        isMain: false,
        name: input.value,
      });
      input.value = "";
      rerenderSelect();
      name_dialog.close();
    }
  });

  // -------
  const obj = Object.assign(
    { default: mainEqaulizerSetting },
    usefulEqaulizerSetting,
    customEqaulizerSetting
  );
  Object.keys(obj).forEach((key) => {
    const option = document.createElement("md-select-option");
    option.value = key;
    option.innerText = key;
    option.dataset.isCustom = customEqaulizerSetting[key]?.isCustom ? "1" : "0";

    select_input.append(option);
  });

  select_input.value = "default";
  select_input.addEventListener("change", function (evt) {
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
  });

  // ---------
  mainEqaulizerSetting.forEach((item, index) => {
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
})();

async function rerenderSelect() {
  const custom = (await Store.get("customEqaulizerSetting")) ?? {};
  select_input.querySelectorAll("md-select-option").forEach((el) => {
    if (el.dataset.isCustom === "1") {
      select_input.removeChild(el);
    }
  });
  Object.keys(custom).forEach((key) => {
    const option = document.createElement("md-select-option");
    option.value = key;
    option.innerText = key;
    option.dataset.isCustom = "1";

    select_input.append(option);
  });
}

export { SliderArray, rerenderSelect };
