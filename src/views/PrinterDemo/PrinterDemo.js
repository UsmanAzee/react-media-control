import React, { useEffect, useState, useRef } from "react";
import { Box, Button, TextField } from "@material-ui/core";
import printerUtils from "./printerUtils";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

const printer_config = {
  id: "3030a56a-16f1-4889-ebe5-08d7ecf38ac2",
  clientCode: "POSIGENT-DEV",
  printerType: 0,
  printerLogoUrl:
    "https://posigentstorage.blob.core.windows.net/logos/637249493094091905.jpg",
  printerMerlinLogoUrl:
    "https://posigentstorage.blob.core.windows.net/logos/637247943448294457.jpg",
  printerIPAddress: "192.168.10.44",
  printerPort: "8043",
  printerDeviceId: "local_printer",
};

const PrinterDemo = () => {
  const [printer, setPrinter] = useState(null);
  const [printerLog, setPrinterLog] = useState("");
  const isConnectingPrinter = useRef(false);

  let ePosDev = null;
  // eslint-disable-next-line no-undef
  ePosDev = new epson.ePOSDevice();

  const connectPrinter = () => {
    ePosDev.disconnect();
    printerUtils.connectPrinter(
      ePosDev,
      printer_config,
      setPrinter,
      setPrinterLog,
      (c) => (isConnectingPrinter.current = c)
    );
  };

  useEffect(() => {
    if (printer !== null) {
      console.log("printer connected");
      alert("printer connected successfuly");
    }
  }, [printer]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p="10px"
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <Button variant="contained" color="primary" onClick={connectPrinter}>
          Connect Printer
        </Button>
        <Box mx={5}>
        {printer === null ? <ClearIcon /> : <CheckIcon />}
        </Box>
      </Box>
      <Box width="100%" my={5}>
        <TextField
          fullWidth
          multiline
          rows={40}
          rowsMax={40}
          variant="outlined"
          value={printerLog}
          onChange={(e) => null}
        />
      </Box>
    </Box>
  );
};

export default PrinterDemo;
