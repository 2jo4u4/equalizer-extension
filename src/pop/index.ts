import "./tab-ctrl";
import "./setting-ctrl";
import "./home-ctrl";
import { SliderArray } from "./board-ctrl";

import { sendMessageToCurrentTabs } from "../util";
import { EmitEvent } from "./customEvent";
import { autoConnectMedia } from "./ids";
import { MdSwitch } from "@material/web/switch/switch";

browser.runtime.onMessage.addListener((msg: SendMsg, tabs) => {
  switch (msg.type) {
    case "initUI": {
      const { fliter, isAutoConnect, isConnect } =
        msg.data as MsgToFormat["initUI"];
      SliderArray.forEach((el, index) => {
        el.value = fliter[index].init;
      });
      const switchBtn = document.querySelector(
        `#${autoConnectMedia}`
      ) as MdSwitch | null;
      if (switchBtn) {
        switchBtn.selected = isAutoConnect;
      }
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
