const fs = require("fs");
const errorLog = err => {
  if (fsExistsSync("log")) {
    fs.writeFile(
      "log/log.text",
      `时间：${date()}/n错误：${err}`,
      function (err) {
        if (err) {
          return console.log(err);
        }
      }
    );
  } else {
    fs.mkdirSync("log");
  }
};

function date() {
  const myDate = new Date();
  const myYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  const myMonth = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
  const myToday = myDate.getDate(); //获取当前日(1-31)
  const myHour = myDate.getHours(); //获取当前小时数(0-23)
  const myMinute = myDate.getMinutes(); //获取当前分钟数(0-59)
  const mySecond = myDate.getSeconds(); //获取当前秒数(0-59)
  return `${myYear}-${myMonth}-${myToday} ${myHour}:${myMinute}:${mySecond}`;
}

function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = errorLog;
