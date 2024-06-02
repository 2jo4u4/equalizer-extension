import { Container, Divider, List, ListItem, ListItemText, Switch, Tooltip } from "@mui/material";

export function Settings(props: { value: boolean; onChange: (val: boolean) => void }) {
  return (
    <Container>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tooltip title={browser.i18n.getMessage("autoConnectMediaTip")}>
          <ListItem>
            <ListItemText primary={browser.i18n.getMessage("autoConnectMedia")} />
            <Switch
              checked={props.value}
              onChange={event => {
                props.onChange(event.target.checked);
              }}
            />
          </ListItem>
        </Tooltip>
        <Divider />
      </List>
    </Container>
  );
}
