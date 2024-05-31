import { Store, alwaysExistFilter, defaluValue, VERSION } from "../util";

function reset() {
  Store.set("autoConnectMedia", 0);
  Store.set("mainEqaulizerSetting", defaluValue);
  Store.set("alwaysExistEqaulizerSetting", alwaysExistFilter);
  Store.set("customEqaulizerSetting", {});
  Store.set("checkDataStatus", { version: VERSION });
}

(async function initStore() {
  const res = await Store.get("checkDataStatus");
  if (res === undefined) {
    reset();
  } else if (res.version !== VERSION) {
    // 版更變更
    Store.clearAll().then(() => {
      reset();
    });
  }
})();
