const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const { errorLog, fsExistsSync, bufferSplit } = require("../utils");

const filePath = path.join(__dirname, "../../file");
const outPutDir = path.join(__dirname, "../../out-files");
const temporaryDir = path.join(filePath, "./temporaryDir");

const concatFiles = (res, params) => {
  try {
    if (!fs.existsSync(outPutDir)) {
      fs.mkdirSync(outPutDir);
    }
    const fileName = querystring.parse(params).name;
    const outPutReadable = fs.createWriteStream(path.join(outPutDir, fileName));
    const files = fs
      .readdirSync(temporaryDir)
      .sort((a, b) => a.split("-")[1] - b.split("-")[1]);
    console.log("files", files);
    const streamMergeRecursive = (files, outPutReadable) => {
      // 递归到尾部情况判断
      if (!files.length) {
        return outPutReadable.end(() => {
          return res.end(
            JSON.stringify({
              code: 200,
              msg: "操作成功",
            })
          );
        });
      }
      const currentFile = path.join(temporaryDir, "./" + files.shift());
      const currentReadStream = fs.createReadStream(currentFile); // 获取当前的可读流

      currentReadStream.pipe(outPutReadable, { end: false });
      currentReadStream.on("end", function () {
        streamMergeRecursive(files, outPutReadable);
      });
      currentReadStream.on("error", function (error) {
        // 监听错误事件，关闭可写流，防止内存泄漏
        errorLog(error);
        outPutReadable.close();
      });
    };

    streamMergeRecursive(files, outPutReadable);
  } catch (error) {
    errorLog(error);
    return res.end(
      JSON.stringify({
        code: 502,
        msg: "操作失败",
      })
    );
  }
};

const singleUpload = (req, res) => {
  try {
    const boundary = `--${
      req.headers["content-type"].split("; ")[1].split("=")[1]
    }`; // 获取分隔符
    let arr = [];

    if (!fs.existsSync(temporaryDir)) {
      fs.mkdirSync(temporaryDir);
    }

    req.on("data", buffer => {
      arr.push(buffer);
    });
    req.on("end", () => {
      const buffer = Buffer.concat(arr);

      // 1. 用<分隔符>切分数据
      let result = bufferSplit(buffer, boundary);

      // 2. 删除数组头尾数据
      result.pop();
      result.shift();

      // 3. 将每一项数据头尾的的\r\n删除
      result = result.map(item => item.slice(2, item.length - 2));

      // 4. 将每一项数据中间的\r\n\r\n删除，得到最终结果
      result.forEach(item => {
        let [info, data] = bufferSplit(item, "\r\n\r\n"); // 数据中含有文件信息，保持为Buffer类型

        info = info.toString(); // info为字段信息，这是字符串类型数据，直接转换成字符串，若为文件信息，则数据中含有一个回车符\r\n，可以据此判断数据为文件还是为普通数据。

        if (info.indexOf("\r\n") >= 0) {
          // 若为文件信息，则将Buffer转为文件保存
          // 获取字段名
          let infoResult = info.split("\r\n")[0].split("; ");
          let name = infoResult[1].split("=")[1];
          name = name.substring(1, name.length - 1);

          // 获取文件名
          let filename = infoResult[2].split("=")[1];
          filename = filename.substring(1, filename.length - 1);
          console.log(name);
          console.log(filename);

          // 将文件存储到服务器
          fs.writeFile(path.join(temporaryDir, filename), data, err => {
            if (err) {
              errorLog(error);
              return res.end(
                JSON.stringify({
                  code: 502,
                  msg: "操作失败",
                })
              );
            }
            return res.end(
              JSON.stringify({
                code: 200,
                msg: "操作成功",
              })
            );
          });
        } else {
          // 若为数据，则直接获取字段名称和值
          let name = info.split("; ")[1].split("=")[1];
          name = name.substring(1, name.length - 1);
          const value = data.toString();
          console.log(name, value);
        }
      });
    });
  } catch (error) {
    errorLog(error);
    return res.end(
      JSON.stringify({
        code: 502,
        msg: "操作失败",
      })
    );
  }
};

const exists = (res, method, params) => {
  try {
    const fileName = querystring.parse(params)?.name?.slice(0, -4);
    if (fsExistsSync(fileName)) {
      const file = fs.readdirSync(Path.join(filePath, fileName));
      if (file.length !== 0) {
        return res.end(
          JSON.stringify({
            code: 200,
            data: {
              chunkIds: "",
              isExists: false,
            },
            msg: "操作成功",
          })
        );
      }
      const sortFileList = file.sort(
        (a, b) => b.split("-")[1] - a.split("-")[1]
      );
      return res.end(
        JSON.stringify({
          code: 200,
          data: {
            chunkIds: sortFileList.at(-1),
            isExists: false,
          },
          msg: "操作失败",
        })
      );
    } else {
      return res.end(
        JSON.stringify({
          code: 200,
          data: {
            chunkIds: "",
            isExists: false,
          },
          msg: "操作成功",
        })
      );
    }
  } catch (error) {
    errorLog(error);
    return res.end(
      JSON.stringify({
        code: 502,
        msg: "操作失败",
      })
    );
  }
};

module.exports = { exists, singleUpload, concatFiles };
