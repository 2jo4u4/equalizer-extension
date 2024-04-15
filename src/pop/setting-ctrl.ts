import { Store } from "../util";
import { auto_connect_btn } from "./bind.element";

(async function () {
  auto_connect_btn.addEventListener("change", function () {
    Store.set("autoConnectMedia", auto_connect_btn.selected ? 1 : 0);
  });
})();
