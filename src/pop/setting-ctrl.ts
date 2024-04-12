import { Store } from "../util";
import { autoConnectMedia } from "./ids";
import type { MdSwitch } from "@material/web/switch/switch";

(async function () {
  const switchBtn = document.querySelector(
    `#${autoConnectMedia}`
  ) as MdSwitch | null;
  if (switchBtn) {
    switchBtn.addEventListener("change", function () {
      Store.set("autoConnectMedia", switchBtn.selected ? 1 : 0);
    });
  }
})();
