import { Store } from "../util";
import { autoConnecntMedia } from "./ids";
import type { MdSwitch } from "@material/web/switch/switch";

(async function () {
  const switchBtn = document.querySelector(
    `#${autoConnecntMedia}`
  ) as MdSwitch | null;
  if (switchBtn) {
    switchBtn.addEventListener("change", function () {
      Store.set("autoConnectMedia", switchBtn.selected ? 1 : 0);
    });
  }
})();
