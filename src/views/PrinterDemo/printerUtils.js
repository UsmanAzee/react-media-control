/* eslint-disable no-undef */
import moment from "moment";
import utils from "../../utils";

const printerType = {
  0: "Kitchen",
  1: "Delivery",
};

const PrintActions = {
  print: 1,
  default: 0,
};

const PrinterConfig = {
  crypto: false,
  buffer: false,
  maxWidth: 576,
  // port: "8088",
  // port: "8084",
  // port: "1234",
};

const PrinterStatus = {
  online: 0,
  offline: 1,
};

const RecieptType = {
  Kitchen: 0,
  Delivery: 1,
};

const tableConfig_n = {
  column1: 10,
  column2: 260,
  column3: 330,
  column4: 430,
  headerStartPosition: 10,
  categoryColumn1: 10,
  categoryColumn2: 350,
  subCategoryColumn1: 80,
  subCategoryColumn2: 430,
  footerColumn1: 50,
  footerColumn2: 370,
};

const tableConfig = {
  center: 288,
  column1: 30,
  column2: 330,
  column3: 400,
  column4: 500,
  headerStartPosition: 0,
  headerEndPosition: 338,
  subHeaderStart: 30,
  subHeaderEnd: 320,
  categoryColumn1: 30,
  categoryColumn2: 300,
  subCategoryColumn1: 70,
  subCategoryColumn2: 470,
  footerColumn1: 80,
  footerColumn2: 400,
};

// cleared log after length exceeds 8192 characters
const MAX_LOG_CHAR_LIMIT = 8192;

const connectPrinter = (
  ePosDev,
  printer_config,
  setPrinter,
  setPrinterLog,
  setIsConnectingPrinter
) => {
  console.count("Connect Printer Count :");

  const addPrinterLog = (logText) => {
    let new_line = `${logText}\t\t[ ${moment().format(
      "hh:mm - ss A"
    )} ]\n--------------------------------\n`;
    setPrinterLog(
      (printerLog) =>
        printerLog.length > MAX_LOG_CHAR_LIMIT
          ? new_line + ` ---- [Log cleared - max buffer reached (8192)] ----`
          : new_line + `${printerLog}\n`
    );
  };

  // let dev_config = ePosDeviceConfiguration(printer_config.printerIPAddress);
  // console.log(dev_config);

  
  addPrinterLog(
    `Connecting to ePOS Device Service Interface ... \nType : ${
      printerType[printer_config.printerType]
    } printer\nConfigurations :\n\tIp :\t\t\t${
      printer_config.printerIPAddress
    }\n\tPort :\t\t${printer_config.printerPort}\n\tDevice ID :\t${
      printer_config.printerDeviceId
    }`
  );

  ePosDev.cookieIo.EXPIRES_MINUTES = 60;
  ePosDev.RECONNECT_TIMEOUT = 10000;
  ePosDev.MAX_RECONNECT_RETRY = 60;
  ePosDev.CONNECT_TIMEOUT = 60000;

  ePosDev.connect(
    printer_config.printerIPAddress,
    printer_config.printerPort,
    (data) =>
      Callback_connect(
        data,
        ePosDev,
        printer_config,
        setPrinter,
        addPrinterLog,
        setIsConnectingPrinter
      )
  );

  ePosDev.onreconnecting = () => {
    addPrinterLog("onReconnecting called.");
    console.log("onReconnecting called.");
  };
  ePosDev.onreconnect = () => {
    addPrinterLog("onReconnect called.");
    console.log("onReconnect called.");
  };
  ePosDev.ondisconnect = () => {
    addPrinterLog("onDisconnect called.");
    console.log("onDisconnect called.");
  };
};

const Callback_connect = (
  data,
  ePosDev,
  printer_config,
  setPrinter,
  addPrinterLog,
  setIsConnectingPrinter
) => {
  var deviceID = printer_config.printerDeviceId;
  var options = {
    crypto: PrinterConfig.crypto,
    buffer: PrinterConfig.buffer,
  };

  if (data === "OK" || data === "SSL_CONNECT_OK") {
    if (data === "OK") {
      console.log("connected to ePOS Device Service Interface.");
      addPrinterLog("ePOS device service interface connection success !");
    } else if (data === "SSL_CONNECT_OK") {
      console.log(
        "connected to ePOS Device Service Interface with SSL.\nSetting up printer ...."
      );
      addPrinterLog(
        "ePOS device service interface with SSL connection success !.\nSetting up printer ...."
      );
    }

    ePosDev.createDevice(
      deviceID,
      ePosDev.DEVICE_TYPE_PRINTER,
      options,
      (data, code) =>
        callbackCreateDevice_printer(
          data,
          code,
          printer_config,
          setPrinter,
          addPrinterLog,
          setIsConnectingPrinter
        )
    );
  } else {
    debugger;
    console.warn(
      "Connecting to ePOS Device Service Interface is failed. [" + data + "]"
    );
    addPrinterLog(
      `ePOS device service interface connection failed.\nError Code : [ ${data} ]`
    );


    setIsConnectingPrinter(false);
  }
};

const callbackCreateDevice_printer = (
  data,
  code,
  printer_config,
  setPrinter,
  addPrinterLog,
  setIsConnectingPrinter
) => {
  if (data == null) {
    debugger;
    console.log(code);
    addPrinterLog(`printer connection failed.\nCode : [ ${code} ]`);
    setIsConnectingPrinter(false);
    return;
  }

  data.timeout = 60000;

  const type = printerType[printer_config.printerType];
  console.log("you can use " + type + " printer.");
  addPrinterLog(`${type} printer connected successfuly.`);

  let printer = data;

  // Set a response receipt callback function
  printer.onreceive = function (res) {
    // Show message
    console.log(
      "Print" +
        (res.success ? "Success" : "Failure") +
        "\nCode:" +
        res.code +
        "\nBattery:" +
        res.battery +
        "\n" +
        getStatusText(printer, res.status)
    );

    addPrinterLog(
      `Print ${res.success ? "Success" : "Failure"}\n\tCode : ${
        res.code
      }\n\tBattery : ${res.battery}\n\t${getStatusText(printer, res.status)}`
    );
  };

  // Set a status change callback funciton
  printer.onstatuschange = function (status) {
    // if (document.getElementById("onstatuschange").checked) {
    //   alert(printerUtils.getStatusText(printer, status));
    // }

    console.log(getStatusText(printer, status));
    addPrinterLog(
      `Printer status changed : [ ${getStatusText(printer, status)} ] `
    );
  };

  printer.interval = 1000;
  printer.startMonitor();

  printer.ononline = function () {
    // if (document.getElementById("ononline").checked) {
    //   alert("online");
    // }
    console.log("printer online");
    addPrinterLog(`Printer online`);
  };

  printer.onoffline = function () {
    console.log("printer offline");
    // setPrinter(null);
    addPrinterLog(`Printer offline`);
  };

  printer.onpoweroff = function () {
    console.log("printer powered off");
    // setPrinter(null);
    addPrinterLog(`Printer powered off`);
  };
  printer.oncoverok = function () {
    console.log("Cover ok");
    addPrinterLog(`Cover ok`);
  };
  printer.oncoveropen = function () {
    console.log("Cover open");
    addPrinterLog(`Cover open`);
  };
  printer.onpaperok = function () {
    console.log("Paper ok");
    addPrinterLog(`Paper ok`);
  };
  printer.onpapernearend = function () {
    console.log("Cover open");
    addPrinterLog(`Cover open`);
  };
  printer.onpaperend = function () {
    console.log("Paper end");
    addPrinterLog(`Paper end.`);
  };

  // printer.ondrawerclosed = function () {
  //   console.log("Drawer closed");
  //   addPrinterLog(`Drawer closed`);
  // };
  // printer.ondraweropen = function () {
  //   console.log("Drawer open");
  //   addPrinterLog(`Drawer open`);
  // };

  // printer.onbatterystatuschange = function () {
  //   console.log("Battery status changed");
  //   addPrinterLog(`Battery status changed`);
  // };
  // printer.onbatteryok = function () {
  //   console.log("Battery Ok");
  //   addPrinterLog(`Battery ok`);
  // };
  // printer.onbatterylow = function () {
  //   console.log("Battery Low");
  //   addPrinterLog(`Battery low`);
  // };

  setPrinter(printer);
};

const getStatusText = (e, status) => {
  var s = "Status: \n";
  if (status & e.ASB_NO_RESPONSE) {
    s += " No printer response\n";
  }
  if (status & e.ASB_PRINT_SUCCESS) {
    s += " Print complete\n";
  }
  if (status & e.ASB_DRAWER_KICK) {
    s += ' Status of the drawer kick number 3 connector pin = "H"\n';
  }
  if (status & e.ASB_OFF_LINE) {
    s += " Offline status\n";
  }
  if (status & e.ASB_COVER_OPEN) {
    s += " Cover is open\n";
  }
  if (status & e.ASB_PAPER_FEED) {
    s += " Paper feed switch is feeding paper\n";
  }
  if (status & e.ASB_WAIT_ON_LINE) {
    s += " Waiting for online recovery\n";
  }
  if (status & e.ASB_PANEL_SWITCH) {
    s += " Panel switch is ON\n";
  }
  if (status & e.ASB_MECHANICAL_ERR) {
    s += " Mechanical error generated\n";
  }
  if (status & e.ASB_AUTOCUTTER_ERR) {
    s += " Auto cutter error generated\n";
  }
  if (status & e.ASB_UNRECOVER_ERR) {
    s += " Unrecoverable error generated\n";
  }
  if (status & e.ASB_AUTORECOVER_ERR) {
    s += " Auto recovery error generated\n";
  }
  if (status & e.ASB_RECEIPT_NEAR_END) {
    s += " No paper in the roll paper near end detector\n";
  }
  if (status & e.ASB_RECEIPT_END) {
    s += " No paper in the roll paper end detector\n";
  }
  if (status & e.ASB_BUZZER) {
    s += " Sounding the buzzer (certain model)\n";
  }
  if (status & e.ASB_SPOOLER_IS_STOPPED) {
    s += " Stop the spooler\n";
  }
  return s;
};

const printSampleText = (printer,  text) => {
  printer.addText(text + "\n");
  printer.addFeed();
  printer.addCut();
  printer.send();
}

class MockPrinter {
  currentPosition = 0;
  textAlign = "ALIGN_LEFT";

  ALIGN_LEFT = "ALIGN_LEFT";
  ALIGN_CENTER = "ALIGN_CENTER";
  ALIGN_RIGHT = "ALIGN_RIGHT";

  BARCODE_CODE39 = "BARCODE_CODE39";
  HRI_BELOW = "HRI_BELOW";
  FONT_A = "FONT_A";

  SYMBOL_QRCODE_MODEL_2 = "SYMBOL_QRCODE_MODEL_2";
  LEVEL_DEFAULT = "LEVEL_DEFAULT";

  brightness = 1.0;
  HALFTONE_DITHER = "HALFTONE_DITHER";

  COLOR_1 = "COLOR_1";
  MODE_MONO = "MODE_MONO";

  constructor() {
    this.mockPrintData = "";
  }

  addSymbol(props) {
    // console.log("add symbol = ");
    // console.log({...props});
  }

  addTextAlign(align) {
    this.textAlign = align;
    // if (align === this.)
    // console.log("text align = " + align);
  }

  addTextPosition(position) {
    if (position >= 0 && position < 576) {
      this.currentPosition = position;
    } else {
      throw new Error(`Invalid Position : [${position}]`);
    }
  }

  breakTextToLineParts(text) {
    const parts = text.match(/.{1,48}/g);
    let partsWithNewLine = parts.map((p) => p + "\n");
    return partsWithNewLine.join("");
  }

  addText(t) {
    // console.log("addText : \n\t" + t);
    let p = Math.round(this.currentPosition / 12);
    let textLine = " ".repeat(p) + t;
    // t = textLine.length > 48 ? this.breakTextToLineParts(textLine) : textLine;
    t = textLine;
    let data = this.mockPrintData + t;
    this.mockPrintData =
      data.length > 48 ? this.breakTextToLineParts(data) : data;
  }

  addImage(props) {
    // console.log("add image");
  }

  addTextSize(x, y) {
    // console.log("text size = " + x + "-" + y);
  }

  addTextSmooth(smooth) {
    // console.log("text smooth = " + smooth);
  }

  addTextStyle(style) {
    // console.log("text style = ");
    // console.log({ ...style });
  }

  addCut() {
    // console.log("cut feed");
  }

  send() {
    let printData = `========================================\n${
      this.mockPrintData.length > 48
        ? this.breakTextToLineParts(this.mockPrintData)
        : this.mockPrintData
    }\n========================================\n`;
    console.log(printData);
    if (this.onreceive) {
      this.onreceive({ success: true });
    }
  }
}

export default {
  connectPrinter,
  Callback_connect,
  MAX_LOG_CHAR_LIMIT,
  PrinterConfig,
  PrinterStatus,
  RecieptType,
  printerType,
  getStatusText,
  MockPrinter,
  PrintActions,
  printSampleText,
};
