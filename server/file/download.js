const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const { errorLog, fsExistsSync } = require("../utils");
const { pipeline } = require("stream");
const filePath = path.resolve(__dirname, "../../", "file");

const eTag = "bfc13a64729c4290ef5b2c2730249c88ca92d82d";

const fileList = async (res, req) => {
  try {
    const getETag = req.headers["If-None-Match".toLocaleLowerCase()]; // 客户端将设置的ETag转化为if-none-match的值
    if (getETag == eTag) {
      res.statusCode = 304;
      res.end();
      return;
    }
    res.setHeader("Cache-Control", "no-cache max-age=0");
    res.setHeader("ETag", eTag); // 服务端生成 ETag token值
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

const download = (res, req, params) => {
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
      if (req.method === "HEAD") {
        const file = fs.statSync(curfilePath);
        res.setHeader("Content-Length", file.size);
        return res.end();
      }
      let range = req.headers?.range;
      if (range) {
        let [, start, end] = range.match(/(\d*)-(\d*)/);
        let statObj = null;
        try {
          statObj = fs.statSync(curfilePath);
        } catch (error) {
          return res.end(
            JSON.stringify({
              code: 502,
              msg: "文件找不到",
            })
          );
        }
        let total = statObj.size;
        //处理请求头中不传范围问题
        start = start ? parseInt(start) : 0;
        end = end ? parseInt(end) : total - 1;
        res.statusCode = 206;
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Connection", "Keep-Alive");
        res.setHeader("Content-Type", "application/octet-stream");
        pipeline(
          fs.createReadStream(curfilePath, {
            start,
            end,
          }),
          res,
          err => {
            if (err) {
              errorLog(err);
              return res.end(
                JSON.stringify({
                  code: 502,
                  msg: "文件传输失败",
                })
              );
            }
          }
        );
      } else {
        // 没有 range 请求头时将整个文件内容返回给客户端
        fs.createReadStream(curfilePath).pipe(res);
      }
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
