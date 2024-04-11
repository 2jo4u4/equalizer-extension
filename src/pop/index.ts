import { sendMessageToCurrentTabs, hzToTitle } from '../util/tool'

function getAllSlider() {
  const sliderArray: NodeListOf<CustomSliderElement> =
    document.querySelectorAll("app-slider");
  return sliderArray;
}

const dashboard = document.createElement("div");
dashboard.id = "dashboard";

const shortcutKey = document.createElement("div");
shortcutKey.id = "shortcut-key";

dashboard.append(shortcutKey);

const storeBtn = document.createElement("button");
storeBtn.innerText = "Store";
storeBtn.onclick = function () {
  sendMessageToCurrentTabs('store-setting', null)
};

const resetBtn = document.createElement("button");
resetBtn.innerText = "Reset";
resetBtn.onclick = function () {
  const sliderArray = getAllSlider();
  sliderArray.forEach((slider) => {
    slider.setValue(0);
    sendMessageToCurrentTabs("ctrl", { id: slider.id, val: 0 });
  });
};

const connectBtn = document.createElement("button");
connectBtn.innerText = "Connect Filter";
connectBtn.onclick = function () {
  sendMessageToCurrentTabs("connect", null);
};
shortcutKey.append(storeBtn, resetBtn, connectBtn);

const container = document.createElement("div");
container.id = "slider-container";

dashboard.append(container);

browser.runtime.onMessage.addListener((msg: SendMsg, tabs) => {
  switch (msg.type) {
    case "initUI": {
      document.body.querySelector('#noMatch')?.remove()
      const _data = msg.data as MsgToFormat['initUI']
      _data.fliter.forEach((item) => {
        const slider = document.createElement("app-slider") as CustomSliderElement;
        slider.setTitle(hzToTitle(item.hz));
        slider.setValue(item.init);
        slider.id = item.id;
        slider.addEventListener("sliderChange", (evt) => {
          sendMessageToCurrentTabs("ctrl", { id: item.id, val: (evt as CustomEvent<number>).detail });
        });
        container.append(slider);
      });

      if (_data.isConnect) {
        connectBtn.remove()
      }
      document.body.append(dashboard);
      break;
    }
    case 'hiddenConnectBtn': {
      connectBtn.remove()
      break
    }
    default: {
      sendMessageToCurrentTabs("debug", msg.data);
      break;
    }
  }
});

sendMessageToCurrentTabs("open", null);
