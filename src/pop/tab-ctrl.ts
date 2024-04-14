import type { MdTabs } from "@material/web/tabs/tabs";
import { boardPanelID, helpPanelID, settingPanelID } from "./ids";

(async function () {
  const tabs = document.querySelector("#tabs") as MdTabs | null;
  if (tabs) {
    const help = document.querySelector(`#${helpPanelID}`) as HTMLElement;
    const board = document.querySelector(`#${boardPanelID}`) as HTMLElement;
    const setting = document.querySelector(`#${settingPanelID}`) as HTMLElement;
    tabs.addEventListener("change", function (evt) {
      board.hidden = tabs.activeTabIndex !== 0;
      help.hidden = tabs.activeTabIndex !== 1;
      setting.hidden = tabs.activeTabIndex !== 2;
    });
  }
})();
