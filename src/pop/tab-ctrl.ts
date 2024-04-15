import {
  tabs,
  tabs_help_container,
  tabs_board_container,
  tabs_setting_container,
} from "./bind.element";

(async function () {
  if (tabs) {
    tabs.addEventListener("change", function () {
      tabs_board_container.hidden = tabs.activeTabIndex !== 0;
      tabs_help_container.hidden = tabs.activeTabIndex !== 1;
      tabs_setting_container.hidden = tabs.activeTabIndex !== 2;
    });
  }
})();
