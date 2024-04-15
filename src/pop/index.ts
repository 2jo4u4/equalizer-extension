import "./tab-ctrl";
import "./setting-ctrl";
import "./help-ctrl";
import { SliderArray } from "./board-ctrl";

import { sendMessageToCurrentTabs } from "../util";
import { EmitEvent } from "./customEvent";
import { auto_connect_btn } from "./bind.element";

browser.runtime.onMessage.addListener((msg: SendMsg, tabs) => {
  switch (msg.type) {
    case "initUI": {
      const { fliter, isAutoConnect, isConnect } =
        msg.data as MsgToFormat["initUI"];
      SliderArray.forEach((el, index) => {
        el.value = fliter[index].init;
      });
      auto_connect_btn.selected = isAutoConnect;
      break;
    }
    case "hiddenConnectBtn": {
      break;
    }
    default:
    case "debug": {
      console.log("debug", msg);
      break;
    }
  }
});

EmitEvent.sliderChange.handle((data) => {
  sendMessageToCurrentTabs("ctrl", data);
});

sendMessageToCurrentTabs("open", null);
