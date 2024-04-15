import type { MdTabs } from "@material/web/tabs/tabs";
import type { MdPrimaryTab } from "@material/web/tabs/primary-tab";
import type { MdSwitch } from "@material/web/switch/switch";
import type { MdFilledButton } from "@material/web/button/filled-button";
import type { MdOutlinedButton } from "@material/web/button/outlined-button";
import type { MdTextButton } from "@material/web/button/text-button";

const tabs = document.querySelector("#tabs") as MdTabs;
const [tabs_board, tabs_help, tabs_setting] = tabs.querySelectorAll(
  "md-primary-tab"
) as NodeListOf<MdPrimaryTab>;
const tabs_board_container = document.querySelector(
  "#board-panel"
) as HTMLDivElement;
const tabs_help_container = document.querySelector(
  "#help-panel"
) as HTMLDivElement;
const tabs_setting_container = document.querySelector(
  "#setting-panel"
) as HTMLDivElement;

const auto_connect_btn = document.querySelector(
  "#auto-connect-media"
) as MdSwitch;

const reset_filter_btn = document.createElement(
  "md-filled-button"
) as MdFilledButton;
reset_filter_btn.innerText = "重置";

const save_filter_btn = document.createElement(
  "md-outlined-button"
) as MdOutlinedButton;
save_filter_btn.innerText = "保存";

const connect_fliter_btn = document.createElement(
  "md-text-button"
) as MdTextButton;
connect_fliter_btn.innerText = "掛載";

export {
  tabs,
  tabs_board,
  tabs_board_container,
  tabs_help,
  tabs_help_container,
  tabs_setting,
  tabs_setting_container,
  auto_connect_btn,
  reset_filter_btn,
  save_filter_btn,
  connect_fliter_btn,
};
