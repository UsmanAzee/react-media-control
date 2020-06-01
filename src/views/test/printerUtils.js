const printerType = {
  0: "Kitchen",
  1: "Delivery",
};

const PrinterConfig = {
  crypto: false,
  buffer: false,
  ip: "192.168.10.44",
  port: "8008",
  deviceID: "local_printer",
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
  column1: 30,
  column2: 330,
  column3: 400,
  column4: 500,
  headerStartPosition: 30,
  categoryColumn1: 30,
  categoryColumn2: 300,
  subCategoryColumn1: 70,
  subCategoryColumn2: 470,
  footerColumn1: 80,
  footerColumn2: 400,
};

const connectPrinter = (setPrinter, setPrinterStatus, addLog) => {
  let ePosDev = null;
  // eslint-disable-next-line no-undef
  ePosDev = new epson.ePOSDevice();
  addLog(
    `Connecting printer :\n\tIp:\t\t\t${PrinterConfig.ip}\n\tPort:\t\t${PrinterConfig.port}\n\tDevice ID:\t${PrinterConfig.deviceID}`
  );
  ePosDev.connect(PrinterConfig.ip, PrinterConfig.port, (data) =>
    Callback_connect(data, ePosDev, setPrinter, setPrinterStatus, addLog)
  );
};

const Callback_connect = (
  data,
  ePosDev,
  setPrinter,
  setPrinterStatus,
  addLog
) => {
  var deviceID = PrinterConfig.deviceID;
  var options = {
    crypto: PrinterConfig.crypto,
    buffer: PrinterConfig.buffer,
  };

  if (data === "OK" || data === "SSL_CONNECT_OK") {
    if (data === "OK") {
      addLog("connected to ePOS Device Service Interface.");
    } else if (data === "SSL_CONNECT_OK") {
      addLog("connected to ePOS Device Service Interface with SSL.");
    }

    ePosDev.createDevice(
      deviceID,
      ePosDev.DEVICE_TYPE_PRINTER,
      options,
      (data, code) =>
        callbackCreateDevice_printer(
          data,
          code,
          setPrinter,
          setPrinterStatus,
          addLog
        )
    );
  } else {
    addLog(
      "Connecting to ePOS Device Service Interface is failed. [" + data + "]"
    );
  }
};

const callbackCreateDevice_printer = (
  data,
  code,
  setPrinter,
  setPrinterStatus,
  addLog
) => {
  if (data == null) {
    addLog(code);
    return;
  }

  addLog("you can use printer.");
  // console.log(PrinterConfig);

  let printer = data;
  // Set a response receipt callback function
  printer.onreceive = function (res) {
    // Show message
    addLog(
      "Print" +
        (res.success ? "Success" : "Failure") +
        "\nCode:" +
        res.code +
        "\nBattery:" +
        res.battery +
        "\n" +
        getStatusText(printer, res.status)
    );
  };
  // Set a status change callback funciton
  printer.onstatuschange = function (status) {
    // if (document.getElementById("onstatuschange").checked) {
    //   alert(printerUtils.getStatusText(printer, status));
    // }

    addLog(getStatusText(printer, status));
  };

  printer.ononline = function () {
    // if (document.getElementById("ononline").checked) {
    //   alert("online");
    // }
    addLog("printer online");
    setPrinterStatus(PrinterStatus.online);
  };

  printer.onoffline = function () {
    // if (document.getElementById("ononline").checked) {
    //   alert("offline");
    // }
    addLog("printer offline");
    setPrinterStatus(PrinterStatus.offline);
  };

  printer.onpoweroff = function () {
    if (document.getElementById("ononline").checked) {
      alert("poweroff");
    }
    addLog("printer powered off");
  };

  setPrinter(printer);

  // printer.oncoverok = function() {
  //   if (document.getElementById("oncoverok").checked) {
  //     alert("coverok");
  //   }
  //   console.log("coverok");
  // };
  // printer.oncoveropen = function() {
  //   if (document.getElementById("oncoverok").checked) {
  //     alert("coveropen");
  //   }
  // };
  // printer.onpaperok = function() {
  //   if (document.getElementById("onpaperok").checked) {
  //     alert("paperok");
  //   }
  // };
  // printer.onpapernearend = function() {
  //   if (document.getElementById("onpaperok").checked) {
  //     alert("papernearend");
  //   }
  // };
  // printer.onpaperend = function() {
  //   if (document.getElementById("onpaperok").checked) {
  //     alert("paperend");
  //   }
  // };
  // printer.ondrawerclosed = function() {
  //   if (document.getElementById("ondrawerclosed").checked) {
  //     alert("drawerclosed");
  //   }
  // };
  // printer.ondraweropen = function() {
  //   if (document.getElementById("ondrawerclosed").checked) {
  //     alert("draweropen");
  //   }
  // };
  // printer.onbatterystatuschange = function() {
  //   if (document.getElementById("onbatterystatuschange").checked) {
  //     alert("onbatterystatuschange");
  //   }
  // };
  // printer.onbatteryok = function() {
  //   if (document.getElementById("onbatteryok").checked) {
  //     alert("onbatteryok");
  //   }
  // };
  // printer.onbatterylow = function() {
  //   if (document.getElementById("onbatteryok").checked) {
  //     alert("onbatterylow");
  //   }
  // };
};

const formatDateTime = (dateString) => {
  if (dateString && dateString !== "") {
    const dt = new Date(dateString);
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    const dtf = new Intl.DateTimeFormat("en", options);
    // const [
    //   { value: mo },
    //   ,
    //   { value: da },
    //   ,
    //   { value: ye }
    // ] = dtf.formatToParts(dt);

    return dtf.format(dt);
  } else {
    return "";
  }
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

const loadImage = async (src, src2, scale) => {
  return new Promise((resolve, reject) => {
    try {
      var image = new Image();
      var image2 = new Image();

      image2.src = src2;
      image2.setAttribute("crossOrigin", "");
      image.src = src;
      image.setAttribute("crossOrigin", "");

      var canvas = document.createElement("canvas");
      canvas.width = 576;
      canvas.height = 100;
      var context = canvas.getContext("2d");

      image2.onload = function () {
        console.log(
          "Image2: Width : " + this.width + "px, Height : " + this.height + "px"
        );

        context.drawImage(this, 10, 0, this.width, 100);

        image.onload = function () {

          this.width = Math.round((this.width / this.height) * 100);
          this.height = 100;

          context.drawImage(this, 576 - this.width - 10, 0, this.width, 100);

          console.log(
            "Image1: Width : " +
              this.width +
              "px, Height : " +
              this.height +
              "px"
          );

          resolve([canvas, context]);
        };
      };
    } catch (e) {
      reject(e);
    }
  });
};

const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  /**
   * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
   * images to fit into a certain area.
   *
   * @param {Number} srcWidth width of source image
   * @param {Number} srcHeight height of source image
   * @param {Number} maxWidth maximum available width
   * @param {Number} maxHeight maximum available height
   * @return {Object} { width, height }
   */

  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
};

const imgSizeFit = (img, maxWidth, maxHeight) => {
  var ratio = Math.min(
    1,
    maxWidth / img.naturalWidth,
    maxHeight / img.naturalHeight
  );
  img.style.width = img.naturalWidth * ratio + "px";
  img.style.height = img.naturalHeight * ratio + "px";
};

const setupStoreLogo = async (
  printer,
  printerLogoUrl,
  merlinLogoUrl,
  imagePosition
) => {
  return new Promise((resolve, reject) => {
    const { x, y, textPosition, scale } = imagePosition;
    loadImage(printerLogoUrl, merlinLogoUrl, scale)
      .then(([canvas, context]) => {
        // printer.addTextAlign(printer.ALIGN_CENTER);
        printer.addTextPosition(textPosition);
        printer.brightness = 1.0;
        printer.halftone = printer.HALFTONE_DITHER;

        console.log(x + " - " + y + ", TextPosition - " + textPosition);

        printer.addImage(
          context,
          x,
          y,
          canvas.width,
          canvas.height,
          printer.COLOR_1,
          printer.MODE_MONO
        );

        printer.addText("\n");

        // printer.addTextAlign(printer.ALIGN_LEFT);

        console.log("Image added");
        resolve(printer);
      })
      .catch((error) => {
        console.log("Image load error : " + error.message);
        reject(error);
      });
  });
};

const setupOrderReciept = (printer, imagePosition) => {
  return new Promise((resolve, reject) => {
    if (printer !== null) {
      setupStoreLogo(
        printer,
        "https://posigentstorage.blob.core.windows.net/logos/637237345525053271.jpg",
        "https://posigentstorage.blob.core.windows.net/logos/637237518523151185.jpg",
        imagePosition
      )
        .then((printer) => {
          resolve(printer);
        })
        .catch((err) => reject(err));
    } else {
      reject("Printer not connected");
    }
  });
};

export default {
  connectPrinter,
  Callback_connect,
  PrinterConfig,
  PrinterStatus,
  RecieptType,
  printerType,
  formatDateTime,
  setupOrderReciept,
};
