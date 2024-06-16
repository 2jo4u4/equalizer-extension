import { createRoot } from "react-dom/client";
import { App } from "./App";
import { Store, DEFALUTVALUE, ALWAYSEXIST, VERSION } from "../util";

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
const root = createRoot(rootElement);
Store.getAll().then(res => {
  const data = Object.assign(
    {
      alwaysExist: ALWAYSEXIST,
      custom: {},
      mainOption: DEFALUTVALUE,
      checkDataStatus: VERSION,
      autoConnectMedia: false,
    },
    res
  );
  root.render(<App storeData={data} />);
});
