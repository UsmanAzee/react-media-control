import moment from "moment";

const getFormattedDate = (dateTimeString) => {
  if (dateTimeString && dateTimeString !== "") {
    const dt = new Date(dateTimeString);
    const options = {
      // hour: "numeric",
      // minute: "numeric",
      // second: "numeric",
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

const getFormattedTime = (dateTimeString) => {
  if (dateTimeString && dateTimeString !== "") {
    const dt = new Date(dateTimeString);
    const options = {
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
      // year: "numeric",
      // month: "short",
      // day: "2-digit",
    };
    const dtf = new Intl.DateTimeFormat("en", options);

    return dtf.format(dt);
  } else {
    return "";
  }
};

const getFormatedDateTime = (dateTimeString) => {
  if (dateTimeString && dateTimeString !== "") {
    const dt = new Date(dateTimeString);
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    const dtf = new Intl.DateTimeFormat("en", options);
    const [{ value: mo }, { value: da }, { value: ye }] = dtf.formatToParts(dt);

    return `${da}-${mo}-${ye}`;
  } else {
    return "";
  }
};

const momentDateTime = (dateTime) => {
  if (dateTime && dateTime !== "") {
    let md_string = moment(new Date(dateTime)).format("MMM DD, YYYY hh:mm A");
    return md_string;
  } else {
    return "";
  }
};

const momentDate = (dateTime) => {
  if (dateTime && dateTime !== "") {
    let md_string = moment(new Date(dateTime)).format("MMM DD, YYYY");
    return md_string;
  } else {
    return "";
  }
};

const momentTime = (dateTime) => {
  if (dateTime && dateTime !== "") {
    let md_string = moment(new Date(dateTime)).format("hh:mm A");
    return md_string;
  } else {
    return "";
  }
};

const momentDatetoISO = (dt) => {
  console.log(moment().format());
  return moment(dt).format("YYYY-MM-DDTHH:mm:ss");
};

const toTimeZone = (date) => {
  // var format = "YYYY/MM/DD HH:mm:ss ZZ";
  // return moment(date).tz(zone).format(format);
  return moment(date).utcOffset("-0700").format();
};

const tableDateFilter = (term, rowData) => {
  const filter =
    new Date(rowData.orderDateTime).getDate() === new Date(term).getDate();
  return filter;
};

const convertDataToCSV = (data) => {
  const array = [Object.keys(data[0])].concat(data);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
};

const parseDriverTotalsData = (data) => {
  const array = [Object.keys(data[0])].concat(data);
  return array
    .map((obj, index) => {
      if (index === 0) return `"${obj.join('","')}"`;
      return `"${Object.values(obj).join('","')}"`;
    })
    .join("\n");
};

const downloadCSV = (csvData, fileName = "myData.csv") => {
  try {
    var link = document.createElement("a");

    var blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();

    return [true, null];
  } catch (e) {
    console.warn("csv download error " + e);
    return [false, e];
  }
};


const playSoundFile = (document, file) => {
  var audio = document.createElement("audio");
  audio.src = file;
  audio.play();
}

export default {
  getFormattedDate,
  getFormattedTime,
  getFormatedDateTime,
  momentDateTime,
  momentDate,
  momentTime,
  momentDatetoISO,
  tableDateFilter,
  convertDataToCSV,
  parseDriverTotalsData,
  downloadCSV,
  toTimeZone,
  playSoundFile
};
