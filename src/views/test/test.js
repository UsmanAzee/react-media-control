import PropTypes from "prop-types";
import React, { useState, useContext } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import QrReader from "react-qr-reader";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography, Card, CardContent } from "@material-ui/core";
import { MyAppContext } from "../../context";
import MuiDialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: theme.spacing(3)
    // alignItems: "center"
  },
  content: {
    marginTop: theme.spacing(1)
  },
  result: {
    flex: 1,
    width: "50%",
    //justifyContent: "flex-start"
    paddingLeft: 50,
    paddingRight: 50
  },
  cameraDisplay: {
    // flex: 1,
    // justifyContent: 'flex-start',
    //alignItems: "center",
    width: "50%",
    height: "00%"
  },
  clearbutton: {
    alignItems: "center",
    width: "100%",
    height: "00%"
    // color: "#01004f"
  }
}));

const SimpleDialog = props => {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;
  const [result, setResult] = useState("QR code not found");

  const { value, setValue } = useContext(MyAppContext);

  const handleScan = data => {
    if (data) {
      setResult(data);
      setValue(data);
    }
  };

  const handleError = err => {
    console.error(err);
  };

  const clearResult = () => {
    setResult("QR code not found");

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = value => {
      onClose(value);
    };

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">QR Scanner</DialogTitle>
        <MuiDialogContent>
          <div className={classes.root}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={6}>
                <QrReader
                  delay={1}
                  onError={handleError}
                  onScan={handleScan}
                  showViewFinder={true}
                  legacyMode={false}
                  className={classes.cameraDisplay}
                />
              </Grid>

              <Grid
                item
                container
                direction="row"
                spacing={2}
                alignItems="center"
                justify="center"
                // direction="column"
                paddingLeft="100"
                xs={10}
              >
                <Grid item xs={12}>
                  <Card variant="outlined" className={classes.resultcard}>
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        {result}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    //color="black"
                    color="primary"
                    onClick={clearResult}
                    className={classes.clearbutton}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </MuiDialogContent>
      </Dialog>
    );
  };

  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired
  };
};

const SimpleDialogDemo = () => {
  const [open, setOpen] = React.useState(false);
  //  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
    // setSelectedValue(value);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        scan
      </Button>
      <SimpleDialog
        // selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};

export default SimpleDialogDemo;
