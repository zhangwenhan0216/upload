const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const { errorLog, fsExistsSync } = require("../utils");

const filePath = path.resolve(__dirname, "../../", "file");
const fileList = async res => {
  try {
    const fileDir = await fs
      .readdirSync(filePath)
      .filter(_ => _.match(/.mp4$/i))
      .map((t, i) => {
        return { id: i, file: t };
      });
    return res.end(
      JSON.stringify({
        code: 200,
        data: fileDir,
        msg: "操作成功",
      })
    );
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

const download = (res, method, params) => {
  try {
    const fileName = querystring.parse(params)?.fileName;
    if (!fileName) {
      return res.end(
        JSON.stringify({
          code: 502,
          msg: "参数错误",
        })
      );
    }
    const curfilePath = path.join(filePath, fileName);
    if (fsExistsSync(curfilePath)) {
      if (method === "HEAD") {
        const file = fs.statSync(curfilePath);
        res.setHeader("Content-Length", file.size);
        return res.end();
      }
      res.setHeader("Connection", "Keep-Alive");
      res.setHeader("Content-Type", "application/octet-stream");
      fs.createReadStream(curfilePath).pipe(res);
    } else {
      return res.end(
        JSON.stringify({
          code: 502,
          msg: "文件已被删除",
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
module.exports = { fileList, download };
