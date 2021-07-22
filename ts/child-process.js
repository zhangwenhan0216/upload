"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
// http.createServer返回一个http.Server的新实例，
// http.Server继承于net.Server(TCP和IPC服务器)
// TCP服务器继承于EventEmitter
var server = http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/plan",
    });
    res.end("I am worker, pid: " + process.pid + ", ppid: " + process.ppid);
    throw new Error("worker process exception!"); // 测试异常进程退出、重启
});
var worker;
process.title = "node-worker";
process.on("message", function (message, sendHandle) {
    if (message === "server") {
        console.log("connection");
        worker = sendHandle;
        // TCP服务器监听的3000端口，客户端通过3000端口访问时触发，socket 是 net.Socket 的实例。
        worker.on("connection", function (socket) {
            // Http服务器触发connection事件注册的每个监听器，
            server.emit("connection", socket);
        });
    }
});
// server中抛出了一个错误，这个事件可以监听到，发送重启进程并将当前进程关闭，
process.on("uncaughtException", function (err) {
    console.log(err);
    process.send({ act: true, message: "err" });
    worker.close(function () {
        process.exit(1);
    });
});
//# sourceMappingURL=child-process.js.map