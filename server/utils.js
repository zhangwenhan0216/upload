const fs = require("fs");
const path = require("path");

const errorLog = err => {
  if (fsExistsSync("log")) {
    fs.appendFile(
      "log/log.text",
      `\n时间：${date()}\n错误：${err}\n`,
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

function fsExistsSync(url) {
  try {
    fs.accessSync(url, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

function bufferSplit(buffer, separator) {
  let result = [];
  let index = 0;

  while ((index = buffer.indexOf(separator)) != -1) {
    result.push(buffer.slice(0, index));
    buffer = buffer.slice(index + separator.length);
  }
  result.push(buffer);

  return result;
}

function removeDir(url) {
  if (fs.existsSync(url)) {
    let files = fs.readdirSync(url);
    if (files.length > 0) {
      files.forEach((file, index) => {
        const curPath = path.join(url, file);
        if (fs.statSync(curPath).isDirectory()) {
          removeDir(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
    }
    fs.rmdirSync(url);
  } else {
    errorLog("路径不存在");
    console.log("路径不存在");
  }
}

module.exports = {
  bufferSplit,
  errorLog,
  fsExistsSync,
  removeDir,
};
