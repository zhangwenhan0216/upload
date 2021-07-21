"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fork = require("child_process").fork;
var cpus = require("os").cpus;
var serve = require("net").createServer();
serve.listen(3000);
process.title = "node-master";
var workers = new Map();
function createWorker() {
    var worker = fork("./child-process.ts");
    worker.on("message", function (message) {
        if (message.act) {
            createWorker();
        }
    });
    worker.on("exit", function () {
        workers.delete(worker.pid);
    });
    worker.send("server", serve);
    workers.set(worker.pid, serve);
}
for (var i = 0, len = cpus.length; i < len; i++) {
    createWorker();
}
// process.once("SIGINT", close.bind(this, "SIGINT"));
// process.once("SIGQUIT", close.bind(this, "SIGQUIT"));
// process.once("SIGTERM", close.bind(this, "SIGTERM"));
// process.once("exit", close.bind(this));
function close(code) {
    var e_1, _a;
    console.log("close-code", code);
    if (code != 0) {
        try {
            for (var workers_1 = __values(workers), workers_1_1 = workers_1.next(); !workers_1_1.done; workers_1_1 = workers_1.next()) {
                var _b = __read(workers_1_1.value, 2), key = _b[0], value = _b[1];
                console.log("master process exited, kill worker pid: ", key);
                value.kill("SIGINT");
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (workers_1_1 && !workers_1_1.done && (_a = workers_1.return)) _a.call(workers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    process.exit(0);
}
//# sourceMappingURL=main-process.js.map