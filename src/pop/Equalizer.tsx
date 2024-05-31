import {
  Slider,
  Grid,
  Typography,
  ButtonGroup,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Divider,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import RestoreIcon from "@mui/icons-material/Restore";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import StarsIcon from "@mui/icons-material/Stars";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { hzToTitle } from "../util";

export function EqualizerSlider(props: {
  filters: Filters;
  onChange?: (filter: Filter, index: number, newVal: number) => void;
}) {
  return (
    <Grid
      gap={0.5}
      container
      sx={{
        flexWrap: "nowrap",
        overflow: "auto",
        scrollbarWidth: "thin",
      }}
    >
      <div style={{ width: 12 }}></div>
      {props.filters.map((filter, index) => {
        return (
          <FilterSlider
            key={index}
            label={hzToTitle(filter.hz)}
            value={filter.gain}
            onChange={(newVal) => {
              props.onChange && props.onChange(filter, index, newVal);
            }}
          ></FilterSlider>
        );
      })}
    </Grid>
  );
}

function FilterSlider(props: {
  label?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const change = (val: number) => {
    props.onChange(val);
  };
  const addition = (amount: number) => {
    change(props.value + amount);
  };
  return (
    <Grid
      item
      width={56}
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      {props.label && (
        <Grid item>
          <Typography variant="caption">{props.label}</Typography>
        </Grid>
      )}
      <Grid item>
        <IconButton
          size="small"
          onClick={() => {
            addition(0.5);
          }}
        >
          <ExpandLessIcon fontSize="small" />
        </IconButton>
      </Grid>
      <Grid item sx={{ my: 1 }}>
        <Slider
          size="small"
          valueLabelDisplay="auto"
          max={12}
          min={-12}
          step={0.5}
          value={props.value}
          onChange={(event, newVal) => {
            change(newVal as number);
          }}
          orientation="vertical"
          sx={{ height: 168 }}
        />
      </Grid>
      <Grid item>
        <IconButton
          size="small"
          onClick={() => {
            addition(-0.5);
          }}
        >
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export function EqualizerSelect(props: {
  filters: FilterOption;
  value: string;
  onSelect: (key: string) => void;
}) {
  return (
    <Grid sx={{ width: 200, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="Equalizer-Select">
          {browser.i18n.getMessage("equalizer")}
        </InputLabel>
        <Select
          labelId="Equalizer-Select"
          value={props.value}
          label="Equalizer"
          onChange={(event) => {
            props.onSelect(event.target.value as string);
          }}
          size="small"
        >
          {Object.keys(props.filters).map((key) => {
            return (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Grid>
  );
}

export function EqualizerButtons(props: {
  onClick: (type: ActionType) => void;
}) {
  return (
    <Grid sx={{ mb: 2 }}>
      <ButtonGroup variant="contained">
        <IconButton
          title={browser.i18n.getMessage("save")}
          onClick={() => {
            props.onClick("save");
          }}
        >
          <SaveIcon />
        </IconButton>
        <IconButton
          title={browser.i18n.getMessage("reset")}
          onClick={() => {
            props.onClick("reset");
          }}
        >
          <RestoreIcon />
        </IconButton>
        <IconButton
          title={browser.i18n.getMessage("medialink")}
          onClick={() => {
            props.onClick("medialink");
          }}
        >
          <InsertLinkIcon />
        </IconButton>
        <IconButton
          title={browser.i18n.getMessage("favorite")}
          onClick={() => {
            props.onClick("favorite");
          }}
        >
          <StarsIcon />
        </IconButton>
        <IconButton
          title={browser.i18n.getMessage("delete")}
          onClick={() => {
            props.onClick("delete");
          }}
        >
          <DeleteForeverIcon />
        </IconButton>
      </ButtonGroup>
    </Grid>
  );
}
