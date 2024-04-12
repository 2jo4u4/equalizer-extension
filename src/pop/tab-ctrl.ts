import type { MdTabs } from "@material/web/tabs/tabs";
import { boardPanelID, homePanelID, settingPanelID } from "./ids";

(async function () {
  const tabs = document.querySelector("#tabs") as MdTabs | null;
  if (tabs) {
    const home = document.querySelector(`#${homePanelID}`) as HTMLElement;
    const board = document.querySelector(`#${boardPanelID}`) as HTMLElement;
    const setting = document.querySelector(`#${settingPanelID}`) as HTMLElement;
    tabs.addEventListener("change", function (evt) {
      home.hidden = tabs.activeTabIndex !== 0;
      board.hidden = tabs.activeTabIndex !== 1;
      setting.hidden = tabs.activeTabIndex !== 2;
    });
  }
})();
