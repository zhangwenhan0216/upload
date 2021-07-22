import { SendHandle } from "node:child_process";
import { IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";

const http = require("http");

// http.createServer返回一个http.Server的新实例，
// http.Server继承于net.Server(TCP和IPC服务器)
// TCP服务器继承于EventEmitter
const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
      "Content-Type": "text/plan",
    });
    res.end("I am worker, pid: " + process.pid + ", ppid: " + process.ppid);
    throw new Error("worker process exception!"); // 测试异常进程退出、重启
  }
);
let worker: any;
process.title = "node-worker";

process.on("message", (message: string, sendHandle: any) => {
  if (message === "server") {
    console.log("connection");
    worker = sendHandle;
    // TCP服务器监听的3000端口，客户端通过3000端口访问时触发，socket 是 net.Socket 的实例。
    worker.on("connection", (socket: Socket) => {
      // Http服务器触发connection事件注册的每个监听器，
      server.emit("connection", socket);
    });
  }
});

// server中抛出了一个错误，这个事件可以监听到，发送重启进程并将当前进程关闭，
process.on("uncaughtException", (err: Error) => {
  console.log(err);
  process.send({ act: true, message: "err" });
  worker.close(() => {
    process.exit(1);
  });
});
