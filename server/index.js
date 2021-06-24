const http = require("http");
const { fileList, download } = require("./file/download");

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
    fileList(res);
  }
  if (path === "/file/download.do") {
    download(res, params);
  }
}

function setHeader(res) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-type,Content-Length,Authorization,Accept,X-Requested-Width"
  );
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("Content-Type", "text/json");
}
