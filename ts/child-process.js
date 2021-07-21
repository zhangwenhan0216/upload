"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
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
        worker = sendHandle;
        worker.on("connection", function (socket) {
            server.emit("connection", socket);
        });
    }
});
process.on("uncaughtException", function (err) {
    console.log(err);
    process.send({ act: true, message: "err" });
    worker.close(function () {
        process.exit(1);
    });
});
//# sourceMappingURL=child-process.js.map