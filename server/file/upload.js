const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const { errorLog, fsExistsSync } = require("../utils");

const filePath = path.join(__dirname, "../../file");

const singleUpload = (res, method, params) => {};

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

module.exports = { exists, singleUpload };
