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
import SettingsIcon from "@mui/icons-material/Settings";

import { Store, alwaysExistFilter, sendMessageToCurrentTabs } from "../util";
import { Help } from "./Help";
import { Settings } from "./Setting";
import { EqualizerButtons, EqualizerSelect, EqualizerSlider } from "./Equalizer";

const defaultFilter = "default";
const tabsize = { height: 36, minHeight: 36 };

export function App() {
  const [ctrlDialog, setCtrlDialog] = React.useState(false);
  const [ctrlAlert, setCtrlAlert] = React.useState({
    open: false,
    msg: "",
    type: "success" as "success" | "error",
  });
  const [tabIndex, setTabIndex] = React.useState(0);
  const [filters, setFilters] = React.useState<FilterOption>({});
  const [curr, setCurr] = React.useState(defaultFilter);
  const [mainFliter, setMainFilter] = React.useState<Filters>(alwaysExistFilter[defaultFilter].filters);
  const [autoConnect, setAutoConnect] = React.useState(false);

  React.useEffect(() => {
    browser.runtime.onMessage.addListener((msg: SendMsg) => {
      switch (msg.type) {
        case "initUI": {
          const data = msg.data as MsgToFormat["initUI"];

          Store.getAll().then(result => {
            const {
              mainEqaulizerSetting = defaultFilter,
              alwaysExistEqaulizerSetting = alwaysExistFilter,
              customEqaulizerSetting = {},
            } = result;

            setCurr(mainEqaulizerSetting);
            setMainFilter(data.fliter);
            setFilters(Object.assign(alwaysExistEqaulizerSetting, customEqaulizerSetting));
            setAutoConnect(false);
          });

          break;
        }
      }
    });
    sendMessageToCurrentTabs("open", null);
  }, []);

  const handleSetFilter = (key: string, _filters: FilterOption = filters) => {
    setCurr(key);
    setMainFilter(_filters[key].filters);
    setFilters(_filters);
    sendMessageToCurrentTabs(
      "groupCtrl",
      _filters[key].filters.map(({ gain }) => gain)
    );
  };

  const handleClose = () => {
    setCtrlDialog(false);
  };

  const openAlertAndClose = (msg: string = "", type: "success" | "error" = "error") => {
    setCtrlAlert({ open: true, msg, type });
    setTimeout(() => {
      setCtrlAlert({ open: false, msg: "", type });
    }, 1000);
  };

  const handleMainFilterChange = (filter: Filter, index: number, newVal: number) => {
    setMainFilter(old => {
      const _newVal = newVal >= 12 ? 12 : newVal <= -12 ? -12 : newVal;
      old[index] = { ...filter, gain: _newVal };
      return [...old];
    });
    sendMessageToCurrentTabs("ctrl", { index, val: newVal });
  };

  const handleMediaAutoConnect = (val: boolean) => {
    setAutoConnect(val);
    Store.set("autoConnectMedia", val ? 1 : 0);
  };

  const handleAction = (type: ActionType) => {
    switch (type) {
      case "favorite": {
        Store.set("mainEqaulizerSetting", curr);
        break;
      }
      case "medialink": {
        sendMessageToCurrentTabs("connect", null);
        break;
      }
      case "reset": {
        setMainFilter([...filters[curr].filters]);
        break;
      }
      case "save": {
        setCtrlDialog(true);
        break;
      }
      case "delete": {
        const _curr = curr;
        Store.get("customEqaulizerSetting").then(res => {
          const _res = res || {};
          delete _res[_curr];
          Store.set("customEqaulizerSetting", _res).then(() => {
            openAlertAndClose(browser.i18n.getMessage("deleteSuccess"), "success");
          });
          setFilters(old => {
            delete old[_curr];
            return { ...old };
          });
        });
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
        {/* <Tab iconPosition="start" icon={<SettingsIcon />} label={browser.i18n.getMessage("setting")} sx={tabsize} /> */}
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
        {tabIndex === 0 && mainFliter && (
          <React.Fragment>
            <EqualizerButtons onClick={handleAction} />
            <EqualizerSelect filters={filters} value={curr} onSelect={handleSetFilter} />
            <EqualizerSlider filters={mainFliter} onChange={handleMainFilterChange} />
          </React.Fragment>
        )}
        {tabIndex === 1 && <Help></Help>}
        {tabIndex === 2 && <Settings value={autoConnect} onChange={handleMediaAutoConnect}></Settings>}
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
            const _filter = mainFliter;
            Store.getAll().then(({ alwaysExistEqaulizerSetting = {}, customEqaulizerSetting = {} }) => {
              if (Object.keys(alwaysExistEqaulizerSetting).includes(filterName)) {
                openAlertAndClose(browser.i18n.getMessage("saveError1"));
              } else if (Object.keys(customEqaulizerSetting).includes(filterName)) {
                openAlertAndClose(browser.i18n.getMessage("saveErroe2"));
              } else {
                const custom = {
                  ...customEqaulizerSetting,
                  [filterName]: { filters: _filter, isCustom: true },
                };
                Store.set("customEqaulizerSetting", custom).then(() => {
                  openAlertAndClose(browser.i18n.getMessage("success"), "success");
                  handleSetFilter(filterName, {
                    ...alwaysExistEqaulizerSetting,
                    ...custom,
                  });
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
