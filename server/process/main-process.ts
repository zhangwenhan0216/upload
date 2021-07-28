import { Imessage } from "./typsing";
import { resolve } from "path";

const fork = require("child_process").fork;
const cpus = require("os").cpus();
const serve = require("net").createServer();

serve.listen(3000);
process.title = "node-master";

const workers = new Map();

function createWorker(): void {
  const worker = fork(resolve(process.cwd(), "./ts/process/child-process.js"));

  worker.on("message", (message: Imessage) => {
    if (message.act) {
      console.log("emit");
      createWorker();
    }
  });

  worker.on("exit", () => {
    workers.delete(worker.pid);
  });

  worker.send("server", serve);
  workers.set(worker.pid, serve);
}

for (let i = 0, len = cpus.length; i < len; i++) {
  createWorker();
}

// process是EventEmitter的实例，
// 给SIGINT SIGOUIT SIGTERM exit事件注册监听，下次触发事件时移除监听触发函数
process.once("SIGINT", close.bind(this, "SIGINT"));
process.once("SIGQUIT", close.bind(this, "SIGQUIT"));
process.once("SIGTERM", close.bind(this, "SIGTERM"));
process.once("exit", close.bind(this));

function close(code: number | string): void {
  console.log("close-code", code);
  if (code != 0) {
    for (const [key, value] of workers) {
      console.log("master process exited, kill worker pid: ", key);
      value.kill("SIGINT");
    }
  }
  process.exit(0);
}
