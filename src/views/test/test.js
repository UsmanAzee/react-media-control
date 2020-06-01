import React, { useState, useContext, useEffect, useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Grid,
  Tooltip,
  IconButton,
  Container,
  Card,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";
import QrReader from "react-qr-reader";
import Axios from "axios";
import printerUtils from "./printerUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  button: {
    margin: "0 5px 0 5px",
  },
  tf: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  iconButton: {
    display: "flex",
    flexDirection: "column",
  },
  cameraDisplay: {
    // flex: 1,
    // justifyContent: 'flex-start',
    //alignItems: "center",
    // width: "100%"
    // height: "100%"
    // width: "auto",
    // height: "auto",
    width: "400px",
    // height: "auto",
  },
}));

const token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UWkZSalE1TkRFM01rUkJNalEyUVVJeE5UQkROekJEUkRrMlFVVTFPVVV5TWpWRE1EVXhNUSJ9.eyJpc3MiOiJodHRwczovL3Bvc2lnZW50LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZDlhZTkzMzFhZTJkZjBkZGZkNzY3ZWQiLCJhdWQiOlsiaHR0cHM6Ly9hcGkucG9zaWdlbnRwb3dlcnNhbGVzLmNvbSIsImh0dHBzOi8vcG9zaWdlbnQuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU4ODkxODY4NiwiZXhwIjoxNTg5MDA1MDg2LCJhenAiOiI2R0tRNGNqQ3VodHV2OU1Mczk3a0JOM1JwY2dkelhQeCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJwZXJtaXNzaW9ucyI6W119.vwDRTSQf8yRqhIDHNWVgaKJR-8pcQ3IuTvz6HKatS-Y6wps83Jltl5aNopv4-e8P3baPb-lk2b-fRlswZ0qEHT1NBNK7a4IwSkITlGda0Z2Ezy03FiB6HpViv3LA76E3Aw86Cqp1nThJ7aPiw2fKH0-4wyCGnDTxLk0t-3iln59kUKJGrNbPf7DE7EmbFdIVmtTlRww7oBUjUhUa3QTPDija4xJOr_4pmX1nnLkhJvbutORM-0zS0-QEDrMlKbARP3R_neQhz4RW-CzV4CWGHnQ6In0cgn_VHwCqhbhZmUxRSEeVZubPL7hHWNQwzkLtyhWS7p_3xemj9TRtNIgTzQ`;

const apiURL = "https://raffleapi.azurewebsites.net/api/";

const ScanReceipt = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [printer, setPrinter] = useState(null);
  const [printerStatus, setPrinterStatus] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [log, setLog] = useState("");
  const [showQrReader, setShowQrReader] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const [imagePosition, setImagePosition] = useState({
    x: 0,
    y: 0,
    textPosition: 0,
    scale: 1,
  });

  const scanCounter = useRef(0);

  const video = useRef();
  const canvas = useRef();

  const showNotification = (variant, msg) => {
    try {
      enqueueSnackbar(msg, {
        variant: variant,
        preventDuplicate: true,
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    } catch (error) {
      console.log("Notification snackbar error, " + error);
    }
  };

  useEffect(() => {
    printerUtils.connectPrinter(setPrinter, setPrinterStatus, addLog);
  }, []);

  const beep = (duration, frequency, volume, type, callback) => {
    //if you have another AudioContext class use that one, as some browsers have a limit
    var audioCtx = new (window.AudioContext ||
      window.webkitAudioContext ||
      window.audioContext)();

    //All arguments are optional:

    //duration of the tone in milliseconds. Default is 500
    //frequency of the tone in hertz. default is 440
    //volume of the tone. Default is 1, off is 0.
    //type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
    //callback to use on end of tone
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (volume) {
      gainNode.gain.value = volume;
    }
    if (frequency) {
      oscillator.frequency.value = frequency;
    }
    if (type) {
      oscillator.type = type;
    }
    if (callback) {
      oscillator.onended = callback;
    }

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + (duration || 500) / 1000);
  };

  const getResult = (id) => {
    return new Promise((resolve, reject) => {
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      Axios.post(
        `${apiURL}RestaurantOrder/UpdateOrderScanStatus`,
        { orderNo: id },
        {
          headers: {
            "content-type": "application/json",
            CLIENT_CODE: "POSIGENT-DEV",
          },
        }
      )
        .then((result) => {
          resolve(result.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const addLog = (line) => {
    setLog((l) => line + "\n" + l);
  };

  const clearLog = () => {
    setLog("");
    setQrValue(null);
    scanCounter.current = 0;
  };

  const stopStream = () => {
    addLog("Stop live stream");
    setShowQrReader(false);
  };

  const startStream = () => {
    setShowQrReader(true);

    // addLog("Starting live stream ...");
    // // Grab elements, create settings, etc.
    // var vid = video.current;
    // // Get access to the camera!
    // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //   // Not adding `{ audio: true }` since we only want video now
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true })
    //     .then(function (stream) {
    //       //video.src = window.URL.createObjectURL(stream);
    //       vid.srcObject = stream;
    //       vid.play();
    //     });
    // }
  };

  const handleError = (err) => {
    showNotification("error", err);
  };

  const handleScan = (data) => {
    if (data) {
      beep(200, 900, 1);
      setQrValue(data);
      setShowQrReader(false);
      scanCounter.current++;
      CheckinOrderNumber(data);

      // if (scanCounter.current < 5) {
      //   scanCounter.current++;
      //   setQrValue(data);
      // }
    }
  };

  useEffect(() => {
    if (qrValue) {
      addLog(`Captured QR code value :\n\t\t\t${qrValue}`);
    }
  }, [qrValue]);

  const CheckinOrderNumber = (orderNumber) => {
    addLog(
      `Get results\t:\n\t\tStore ID\t:\t\tPOSIGENT-DEV\n\t\tOrder Number\t:\t${orderNumber}`
    );
    getResult(orderNumber)
      .then((response) => {
        console.log(response);
        addLog(`\tSTAGE\t:\t${scanCounter.current}`);
        addLog(`${response}`);
        showNotification("info", response);
      })
      .catch((err) => {
        console.log(err);
        showNotification("error", err.message);
      });
  };

  const printSample = () => {
    if (printer !== null) {
      printerUtils
        .setupOrderReciept(printer, imagePosition)
        .then((printer) => {
          // printer.addText("\n");
          printer.addCut();
          console.log("Print Send !!");
          printer.send();
        })
        .catch((err) => alert(err));
    } else {
      alert("printer not connected");
    }
  };

  return (
    <div className={classes.root}>
      <Card elevation={3}>
        <Box p={theme.spacing(0.2)}>
          <Grid
            container
            spacing={1}
            // justifyContent="center"
            alignItems="flex-start"
          >
            <Grid
              item
              container
              xs={12}
              md={6}
              spacing={1}
              direction="column"
              alignItems="center"
              // justifyContent="center"
              // style={{ width: "100%", minHeight: 400 }}
              // width="100%"
              // minHeight={400}
            >
              <Grid item xs={12} style={{ width: "100%" }}>
                <Box display="flex" alignItems="center" width="100%">
                  <TextField
                    fullWidth={true}
                    name="code"
                    label="Order Number"
                    value={qrValue || ""}
                    onChange={(e) => {
                      setQrValue(e.target.value);
                    }}
                  />
                  <Box mx={theme.spacing(0.1)}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => CheckinOrderNumber(qrValue)}
                    >
                      Get Results
                    </Button>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth={true}
                  name="code"
                  label="x-position"
                  placeholder="0 - 576"
                  value={imagePosition.x}
                  onChange={(e) => {
                    setImagePosition({ ...imagePosition, x: e.target.value });
                  }}
                />
                <TextField
                  fullWidth={true}
                  name="code"
                  label="y-position"
                  placeholder="0 - Max"
                  value={imagePosition.y}
                  onChange={(e) => {
                    setImagePosition({ ...imagePosition, y: e.target.value });
                  }}
                />
                <TextField
                  fullWidth={true}
                  name="code"
                  label="Text position"
                  placeholder="0 - 576"
                  value={imagePosition.textPosition}
                  onChange={(e) => {
                    setImagePosition({
                      ...imagePosition,
                      textPosition: e.target.value,
                    });
                  }}
                />
                <TextField
                  fullWidth={true}
                  name="code"
                  label="Scale"
                  placeholder="1 - max"
                  value={imagePosition.scale}
                  onChange={(e) => {
                    setImagePosition({
                      ...imagePosition,
                      scale: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex">
                  <Box mx={theme.spacing(0.1)}>
                    <Button variant="outlined" onClick={startStream}>
                      Start QR Scanner
                    </Button>
                  </Box>
                  <Button variant="outlined" onClick={stopStream}>
                    Stop QR Scanner
                  </Button>
                  <Button variant="outlined" onClick={printSample}>
                    Print Sample
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  textAlign="center"
                  mt={2}
                  id="stream_container"
                  width="100%"
                  bgcolor="lightgreen"
                >
                  {/* <video ref={video} width="320" height="240" autoPlay style={{marginRight:'10px'}}></video>
              <canvas ref={canvas} width="320" height="240"></canvas> */}
                  {showQrReader && (
                    <QrReader
                      delay={1}
                      onError={handleError}
                      onScan={handleScan}
                      showViewFinder={true}
                      legacyMode={false}
                      className={classes.cameraDisplay}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>

            <Grid
              item
              container
              xs={12}
              md={6}
              // justifyContent="flex-end"
              // style={{ width: "100%" }}
              // width="100%"
            >
              <Grid item style={{ flex: 1 }}>
                <TextField
                  name="log"
                  label="Log"
                  multiline={true}
                  rows={31}
                  rowsMax={31}
                  fullWidth={true}
                  value={log}
                  disabled={true}
                  variant="outlined"
                />
              </Grid>

              <Grid item>
                <Box
                  border="1px solid grey"
                  borderRadius={5}
                  height="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <Tooltip title="Clear log">
                    <IconButton
                      onClick={clearLog}
                      className={classes.iconButton}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        fontSize={12}
                      >
                        <DeleteIcon />
                        Clear
                      </Box>
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </div>
  );
};

export default ScanReceipt;
