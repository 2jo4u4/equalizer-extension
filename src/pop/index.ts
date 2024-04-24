import "./tab-ctrl";
import "./setting-ctrl";
import "./help-ctrl";
import { SliderArray, rerenderSelect } from "./board-ctrl";

import { sendMessageToCurrentTabs } from "../util";
import { auto_connect_btn } from "./bind.element";

browser.runtime.onMessage.addListener((msg: SendMsg, tabs) => {
  switch (msg.type) {
    case "initUI": {
      const { fliter, isAutoConnect } = msg.data as MsgToFormat["initUI"];
      SliderArray.forEach((el, index) => {
        el.value = fliter[index].gain;
      });
      auto_connect_btn.selected = isAutoConnect;
      break;
    }
    case "rerender": {
      const { module, name } = msg.data as MsgToFormat["rerender"];
      rerenderSelect(module === "filter-select-add" ? name : undefined);
      break;
    }
    default:
    case "debug": {
      console.log("debug", msg);
      break;
    }
  }
});

sendMessageToCurrentTabs("open", null);
