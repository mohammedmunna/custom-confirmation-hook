import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Typography
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: "capitalize",
    margin: "0 10px",
    borderRadius: "16px",
    minWidth: "6rem"
  }
}));

// useConfirmation hook
export default function useConfirmation() {
  const classes = useStyles();
  const [openDefault, setOpenDefault] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [resolver, setResolver] = useState();
  const [dialogState, setDialogState] = useState({
    offer: {},
    entity: "",
    item: {}
  });
  const [buttons, setButtons] = useState([
    { label: "create", value: "create" },
    { label: "map", value: "map" },
    { label: "skip", value: "skip" }
  ]);

  // Create a new Promise and capture its resolve function in the resolver variable
  const createPromise = () => {
    let resolver;
    const promise = new Promise((resolve, reject) => {
      resolver = resolve;
    });
    return [promise, resolver];
  };

  const getConfirmation = async ({
    offer = {},
    entity = "",
    item = {},
    buttons = [
      { label: "create", value: "create" },
      { label: "skip", value: "skip" }
    ]
  }) => {
    setDialogState({ offer, entity, item });
    setButtons(buttons);
    setOpenDefault(true);
    const [promise, resolve] = await createPromise();
    setResolver(() => resolve);
    return promise;
  };

  const joinArrayWithOr = (arr, key) => {
    return arr
      .map((item) => item[key])
      .join(", ")
      .replace(/,([^,]*)$/, " or $1");
  };

  const handleClick = async (status) => {
    setDialogState((prev) => ({ ...prev, status: status }));
    if (status === "map") {
      setOpenDefault(false);
      setOpenMap(true);
    } else {
      setOpenDefault(false);
      resolver(status);
    }
  };

  const handleConfirm = async (status) => {
    setDialogState((prev) => ({ ...prev, status: status }));
    setOpenMap(false);
    resolver(status);
  };

  const handleBack = () => {
    setDialogState((prev) => ({ ...prev, status: "default" }));
    setOpenMap(false);
    setOpenDefault(true);
  };

  const MapContent = () => (
    <div>
      <Dialog open={openMap} fullWidth maxWidth={"md"}>
        <DialogTitle id="map-confirmation-dialog-title">
          {`${_.startCase(dialogState?.entity || "Item")}`}
        </DialogTitle>
        <DialogContent style={{ padding: "1rem 1.5rem" }}>
          <DialogContentText style={{ marginBottom: "0.1rem" }}>
            TABLE
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            padding: "0.8rem"
          }}
        >
          <Button
            onClick={() => handleBack()}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Back
          </Button>
          <Button
            onClick={() => handleConfirm("confirm")}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  const DefaultContent = () => (
    <div>
      <Dialog open={openDefault} fullWidth maxWidth={"sm"}>
        <DialogTitle id="default-confirmation-dialog-title">
          {`${_.startCase(dialogState?.entity || "Item")} Not Found`}
        </DialogTitle>
        <DialogContent style={{ padding: "1rem 1.5rem" }}>
          <DialogContentText style={{ marginBottom: "0.1rem" }}>
            <Typography
              gutterBottom
            >{`Below entity of offer ${dialogState?.offer?.name} is not found.`}</Typography>
            <Typography
              gutterBottom
              style={{ fontWeight: "bold" }}
            >{`${_.startCase(dialogState?.entity)} : ${
              dialogState?.item?.name
            }`}</Typography>
            <Typography>
              {`Would you like to ${joinArrayWithOr(buttons, "label")}?`}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            padding: "1.5rem",
            justifyContent: "center"
          }}
        >
          {buttons.map((b) => (
            <Button
              key={b.value}
              onClick={() => handleClick(b.value)}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              {b.label}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </div>
  );

  const ConfirmationDialog = () => {
    return (
      <div>
        <DefaultContent />
        <MapContent />
      </div>
    );
  };

  return [getConfirmation, ConfirmationDialog];
}
