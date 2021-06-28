const fs = require("fs");
const path = require("path");
// const Promise = require("bluebird");
// const stream = require("readable-stream");
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

function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
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

/**
 * Merge all input files by pipeline stream
 * @access private
 * @param {array} inputPathList
 * @param {string} outputPath
 * @param {int} chunkSize[optional]
 *
 * @returns {Promise}
 */
const streamMerge = (
  inputPathList,
  outputPath,
  chunkSize = 2 * 1024 * 1024
) => {
  // Validate inputPathList.
  if (inputPathList.length <= 0) {
    return Promise.reject(new Error("Please input an array with files path!"));
  }

  // create writable stream for output
  const output = fs.createWriteStream(outputPath, {
    encoding: null,
  });

  return Promise.mapSeries(inputPathList, function (item) {
    return new Promise(function (resolve, reject) {
      const input = fs.createReadStream(item, {
        encoding: null,
      });

      const inputStream = new stream.Readable({
        // equivalent to controlling the size of a bucket
        highWaterMark: chunkSize, // the size of each on data of the control flow, the default is 16kb
      }).wrap(input);

      // pipeline data flow
      inputStream.pipe(output, {
        end: false,
      });
      inputStream.on("error", reject);
      inputStream.on("end", resolve);
    });
  }).then(function () {
    // close the stream to prevent memory leaks
    output.close();
    return Promise.resolve(outputPath);
  });
};

module.exports = {
  // streamMerge,
  bufferSplit,
  errorLog,
  fsExistsSync,
};
