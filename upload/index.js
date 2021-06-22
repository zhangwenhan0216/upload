const http = require("http");

const server = http.createServer((req, res) => {});

server.listen("1235", () => {
  console.log("服务启动成功, 监听1235端口成功");
});
