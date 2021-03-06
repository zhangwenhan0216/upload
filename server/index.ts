const { fileList, download } = require("./file/download");
const { exists, singleUpload, concatFiles } = require("./file/upload");

function serverCallback(req: any, res: any) {
  setHeader(res);
  // 处理预请求
  if (req.method === "OPTIONS") {
    return res.end();
  }
  const url = req.url.split("?");
  const path = url[0],
    params = url[1];
  if (path === "/file.do") {
    return fileList(res, req);
  }
  if (path === "/file/download.do") {
    return download(res, req, params);
  }
  if (path === "/upload/exists.do") {
    return exists(res, req.method, params);
  }
  if (path === "/upload/single_upload.do") {
    return singleUpload(req, res);
  }
  if (path === "/upload/concat_files.do") {
    return concatFiles(res, params);
  }
}

function setHeader(res: any) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Content-Type", "text/json");
}

export default serverCallback;
