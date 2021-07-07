const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const { createGzip } = require("zlib");
const { Transform } = require("stream");

// 改写之前的写入写入准备文件代码，得到一个1KB大小的文件
const smallFile = path.join(__dirname, "../1KB.txt");
const upperFile = path.join(__dirname, "../upper_text_pipe.gz");

const readableStream = fs.createReadStream(smallFile, {
  encoding: "utf-8",
  highWaterMark: 1 * 256,
});
const writeableStream = fs.createWriteStream(upperFile, {
  encoding: "utf-8",
  highWaterMark: 1 * 10,
}); // 修改小是为了触发drain

const upperCaseTr = new Transform({
  transform(chunk, encoding, callback) {
    console.log("chunk", chunk);
    this.push(chunk.toString().toUpperCase());
    // 故障
    callback();
  },
});

// 组合管道链
readableStream.pipe(createGzip()).pipe(upperCaseTr).pipe(writeableStream);

upperCaseTr.on("error", err => {
  console.log("upperCaseTr error", err);
  // 如果中间段出错，应该关闭管道链其他流
  writeableStream.destroy();
  readableStream.destroy();
});

// end
readableStream.on("end", function () {
  console.log(chalk.redBright("可读流end"));
});

// close
readableStream.on("close", function () {
  console.error("可读流close");
});

readableStream.on("data", chunk => {
  console.log(chalk.green("压缩前--->", Buffer.byteLength(chunk)));
});

writeableStream.on("drain", function () {
  console.log(chalk.gray("可写流drain"));
});

writeableStream.on("close", function () {
  console.log(chalk.redBright("可写流close"));
});

writeableStream.on("finish", function () {
  console.log(chalk.redBright("可写流finish"));
});

writeableStream.on("error", function (err) {
  console.error("可写流error", err);
});
