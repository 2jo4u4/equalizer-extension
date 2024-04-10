async function getCurrentTabs() {
    return await browser.tabs.query({ active: true, currentWindow: true });
}

async function sendMessageToCurrentTabs(type: NotifyType, data?: any) {
    getCurrentTabs().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id ?? 0, { type, data });
    });
}

function getAllSlider() {
    const sliderArray: NodeListOf<CustomSliderElement> = document.querySelectorAll("app-slider")
    return sliderArray
}

const initData: Filter[] = [
    { id: "f1", hz: 60, init: 0, type: "peaking", title: "60 HZ" },
    { id: "f2", hz: 230, init: 0, type: "peaking", title: "230 HZ" },
    { id: "f3", hz: 910, init: 0, type: "peaking", title: "910 HZ" },
    { id: "f4", hz: 4000, init: 0, type: "peaking", title: "4k HZ" },
    { id: "f5", hz: 14000, init: 0, type: "peaking", title: "14k HZ" },
];

function changeValue(event: CustomEvent<number>, item: Filter) {
    sendMessageToCurrentTabs("ctrl", { id: item.id, val: event.detail });
}

const dashboard = document.createElement("div");
dashboard.id = "dashboard";

const shortcutKey = document.createElement("div");
shortcutKey.id = "shortcut-key";

dashboard.append(shortcutKey);

const resetBtn = document.createElement("button");
resetBtn.innerText = "Reset";
resetBtn.onclick = function () {
    const sliderArray = getAllSlider()
    sliderArray.forEach((slider) => {
        slider.setValue(0);
        sendMessageToCurrentTabs("ctrl", { id: slider.id, val: 0 });
    });
};

const connectBtn = document.createElement("button");
connectBtn.innerText = "Connect Filter";
connectBtn.onclick = function () {
    sendMessageToCurrentTabs("connect");
};
shortcutKey.append(resetBtn, connectBtn);

const container = document.createElement("div");
container.id = "slider-container";

dashboard.append(container);

initData.forEach((item) => {
    const slider = document.createElement("app-slider") as CustomSliderElement
    slider.setTitle(item.title);
    slider.setValue(item.init);
    slider.id = item.id;
    slider.addEventListener("sliderChange", (evt) => {
        changeValue((evt as CustomEvent<number>), item);
    });
    container.append(slider);
});

document.body.append(dashboard);

sendMessageToCurrentTabs("open", initData);

browser.runtime.onMessage.addListener(({ type, ...other }) => {
    /** @type {"initSlider"} */
    const action = type;
    switch (action) {
        case "initSlider": {
            /** @type {{id: string; val: number}[]} */
            const _data = other.data;
            const sliderArray = getAllSlider()
            sliderArray.forEach((slider, index) => {
                slider.setValue(_data[index].val);
            });
            break;
        }
        default:
            sendMessageToCurrentTabs("debug", other);
            break;
    }
});
