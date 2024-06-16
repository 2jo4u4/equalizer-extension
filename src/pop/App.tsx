import React from "react";
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Alert,
  Collapse,
} from "@mui/material";
import StraightenIcon from "@mui/icons-material/Straighten";
import HelpIcon from "@mui/icons-material/Help";

import { Store, sendMessageToCurrentTabs, StoreDataType, cloneFilters } from "../util";
import { Help } from "./Help";
import { EqualizerButtons, EqualizerSelect, EqualizerSlider } from "./Equalizer";

const tabsize = { height: 36, minHeight: 36 };

export function App({ storeData }: { storeData: Required<StoreDataType> }) {
  const [ctrlDialog, setCtrlDialog] = React.useState(false);
  const [ctrlAlert, setCtrlAlert] = React.useState({
    open: false,
    msg: "",
    type: "success" as "success" | "error",
  });
  const [tabIndex, setTabIndex] = React.useState(0);
  const [curr, setCurr] = React.useState(storeData.mainOption);
  const [filterMap, setFilterMaps] = React.useState<FilterMaps>(
    new Map([...storeData.alwaysExist, ...storeData.customMap])
  );
  const [mainFilter, setMainFilter] = React.useState<Filters>(() => {
    const { filters } = filterMap.get(curr) as FilterObject;
    return filters;
  });

  React.useEffect(() => {
    browser.runtime.onMessage.addListener((msg: SendMsg) => {
      switch (msg.type) {
        case "initUI": {
          const { filters } = msg.data as MsgToFormat["initUI"];
          setMainFilter(cloneFilters(filters));
          break;
        }
      }
    });
    sendMessageToCurrentTabs("open", null);
  }, []);

  /**
   * 選單設定等化器
   * @param key 選項值
   * @param map 所有選項(更新可選的選項: 儲存成功時)
   */
  const handleSetFilter = (key: string, map: FilterMaps = filterMap) => {
    const f = cloneFilters((map.get(key) as FilterObject).filters);
    setCurr(key);
    setMainFilter(f);
    setFilterMaps(map);
    sendMessageToCurrentTabs(
      "ctrl",
      f.map(({ gain }, index) => ({ index, val: gain }))
    );
  };

  /**
   * 關閉 命名對話窗
   */
  const handleClose = () => {
    setCtrlDialog(false);
  };

  /**
   * 使用者操作後提示之訊息
   * @param msg 提示使用者之訊息
   * @param type 類型樣式
   */
  const openAlertAndClose = (msg: string = "", type: "success" | "error" = "error") => {
    setCtrlAlert({ open: true, msg, type });
    setTimeout(() => {
      setCtrlAlert({ open: false, msg: "", type });
    }, 1000);
  };

  /**
   * 變更當前的等化器設定
   * @param filter 等化器
   * @param index 引索值(第幾個)
   * @param newVal 變更後的值
   */
  const handleMainFilterChange = (index: number, newVal: number) => {
    setMainFilter(old => {
      const gain = newVal >= 12 ? 12 : newVal <= -12 ? -12 : newVal;
      old[index].gain = gain;
      return cloneFilters(old);
    });
    sendMessageToCurrentTabs("ctrl", [{ index, val: newVal }]);
  };

  const handleAction = (type: ActionType) => {
    switch (type) {
      case "favorite": {
        Store.set("mainOption", curr);
        break;
      }
      case "medialink": {
        sendMessageToCurrentTabs("connect", null);
        break;
      }
      case "reset": {
        const { filters } = filterMap.get(curr) as FilterObject;
        setMainFilter(cloneFilters(filters));
        break;
      }
      case "save": {
        setCtrlDialog(true);
        break;
      }
      case "delete": {
        const _curr = curr;
        const filterObj = filterMap.get(_curr);
        if (filterObj && filterObj.i18nKey === undefined) {
          Store.getAll().then(res => {
            const { alwaysExist, customMap } = res;
            const _alwaysExist = new Map(alwaysExist);
            const _customMap = new Map(customMap);
            _customMap.delete(_curr);
            setFilterMaps(new Map([..._alwaysExist, ..._customMap]));
            Store.set("customMap", _customMap).then(() => {
              openAlertAndClose(browser.i18n.getMessage("deleteSuccess"), "success");
            });
          });
        } else {
          openAlertAndClose(browser.i18n.getMessage("deleteFail"), "error");
        }
        break;
      }
    }
  };

  return (
    <Box width={350} sx={{ p: 1 }}>
      <Tabs
        value={tabIndex}
        onChange={(_, newVal) => {
          setTabIndex(newVal);
        }}
        scrollButtons="auto"
        sx={tabsize}
      >
        <Tab iconPosition="start" icon={<StraightenIcon />} label={browser.i18n.getMessage("equalizer")} sx={tabsize} />
        <Tab iconPosition="start" icon={<HelpIcon />} label={browser.i18n.getMessage("help")} sx={tabsize} />
      </Tabs>
      <Paper
        elevation={3}
        sx={{
          p: 1,
          minHeight: 200,
          maxHeight: 400,
          width: "100%",
          overflow: "auto",
          boxSizing: "border-box",
          scrollbarWidth: "thin",
          mb: 1,
        }}
      >
        {tabIndex === 0 && mainFilter && (
          <React.Fragment>
            <EqualizerButtons onClick={handleAction} />
            <EqualizerSelect filterMaps={filterMap} value={curr} onSelect={handleSetFilter} />
            <EqualizerSlider filters={mainFilter} onChange={handleMainFilterChange} />
          </React.Fragment>
        )}
        {tabIndex === 1 && <Help></Help>}
      </Paper>
      <Dialog
        open={ctrlDialog}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const filterName = formJson.filterName as string;
            const filters = cloneFilters(mainFilter);
            Store.getAll().then(({ alwaysExist, customMap }) => {
              const _alwaysExist = new Map(alwaysExist);
              const _customMap = new Map(customMap);
              if (_alwaysExist.has(filterName)) {
                openAlertAndClose(browser.i18n.getMessage("saveError1"));
              } else if (_customMap.has(filterName)) {
                openAlertAndClose(browser.i18n.getMessage("saveErroe2"));
              } else {
                _customMap.set(filterName, { filters });
                Store.set("customMap", _customMap).then(() => {
                  openAlertAndClose(browser.i18n.getMessage("saveSuccess"), "success");
                  const totalMap = new Map([..._alwaysExist, ..._customMap]);
                  handleSetFilter(filterName, totalMap);
                });
              }
            });
            handleClose();
          },
        }}
      >
        <DialogTitle>{browser.i18n.getMessage("saveDialogTitle")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            id="filterName"
            name="filterName"
            label={browser.i18n.getMessage("saveDialogField")}
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{browser.i18n.getMessage("cencel")}</Button>
          <Button type="submit">{browser.i18n.getMessage("confirm")}</Button>
        </DialogActions>
      </Dialog>
      <Collapse in={ctrlAlert.open}>
        <Alert severity={ctrlAlert.type}>{ctrlAlert.msg}</Alert>
      </Collapse>
    </Box>
  );
}
