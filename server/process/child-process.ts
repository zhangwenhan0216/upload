import { SendHandle } from "child_process";
import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";

const http = require("http");

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
      "Content-Type": "text/plan",
    });
    res.end("I am worker, pid: " + process.pid + ", ppid: " + process.ppid);
    throw new Error("worker process exception!"); // 测试异常进程退出、重启
  }
);

let worker: SendHandle;
process.title = "node-worker";

process.on("message", (message: string, sendHandle: SendHandle) => {
  if (message === "server") {
    worker = sendHandle;
    worker.on("connection", (socket: Socket) => {
      server.emit("connection", socket);
    });
  }
});

process.on("uncaughtException", (err: Error) => {
  console.log(err);
  process.send({ act: true, message: "err" });
  worker.close(() => {
    process.exit(1);
  });
});
