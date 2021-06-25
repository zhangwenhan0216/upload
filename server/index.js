const http = require("http");
const { fileList, download } = require("./file/download");
const { exists, singleUpload } = require("./file/upload");

const server = http.createServer(serverCallback);

server.listen("1235", "127.0.0.1", () => {
  console.log("服务启动成功, 监听1235端口成功");
});

function serverCallback(req, res) {
  setHeader(res);
  const url = req.url.split("?");
  const path = url[0],
    params = url[1];
  if (path === "/file.do") {
    return fileList(res);
  }
  if (path === "/file/download.do") {
    return download(res, req.method, params);
  }
  if (path === "/upload/exists.do") {
    return exists(res, req.method, params);
  }
  if (path === "/upload/single_upload.do") {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
    });
    req.on("end", () => {
      console.log("datadatadatadatadata", data);
    });
    return singleUpload(res, req.method, params);
  }
}

function setHeader(res) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Content-Type", "text/json");
}
