const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const errorLog = require("../utils");
const fileList = async res => {
  try {
    const filePath = path.resolve(__dirname, "../../", "file");
    const fileDir = await fs
      .readdirSync(filePath)
      .filter(_ => _.match(/.mp4$/i))
      .map((t, i) => {
        return { id: i, file: t.slice(0, -4) };
      });
    res.end(
      JSON.stringify({
        code: 200,
        data: fileDir,
        msg: "操作成功",
      })
    );
  } catch (error) {
    errorLog(error);
    res.end(
      JSON.stringify({
        code: 502,
        msg: "操作失败",
      })
    );
  }
};

const download = (res, params) => {
  try {
    const fileName = querystring.parse(params)?.fileName;
    if (!fileName) {
      res.end(
        JSON.stringify({
          code: 502,
          msg: "参数错误",
        })
      );
      return;
    }

    res.end(
      JSON.stringify({
        code: 200,
        data: req.url,
        msg: "操作成功",
      })
    );
  } catch (error) {
    errorLog(error);
  }
};
module.exports = { fileList, download };
