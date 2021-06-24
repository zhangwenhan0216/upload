const http = require("http");
const net = require("net");
const { URL } = require("url");

const proxy = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/plain" });
  res.end("okay");
});

proxy.on("connect", (req, clientSocket, head) => {
  console.log("3", req.url, head);
  // 连接到源服务器
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write(
      "HTTP/1.1 200 Connection Established\r\n" +
        "Proxy-agent: Node.js-Proxy\r\n" +
        "\r\n"
    );
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

proxy.listen("1338", "127.0.0.1", () => {
  const options = {
    port: "1338",
    host: "127.0.0.1",
    method: "CONNECT",
    path: "127.0.0.1:1235",
  };

  const req = http.request(options);
  req.end();

  req.on("connect", (res, socket, head) => {
    console.log("1", "got connected!");
    socket.write("GET / HTTP/1.1\r\n" + "\r\n");
    socket.on("data", chunk => {
      console.log("2", chunk.toString());
    });
    socket.on("end", () => {
      proxy.close();
    });
  });
});
