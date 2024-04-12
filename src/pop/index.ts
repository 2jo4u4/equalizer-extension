import "./tab-ctrl";
import "./setting-ctrl";
import "./home-ctrl";
import { SliderArray } from "./board-ctrl";

import { sendMessageToCurrentTabs } from "../util";
import { EmitEvent } from "./customEvent";

browser.runtime.onMessage.addListener((msg: SendMsg, tabs) => {
  switch (msg.type) {
    case "initUI": {
      const { fliter } = msg.data as MsgToFormat["initUI"];
      SliderArray.forEach((el, index) => {
        el.value = fliter[index].init;
      });
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
