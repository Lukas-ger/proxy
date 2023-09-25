"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const proxy_config_1 = __importDefault(require("./proxy_config"));
exports.default = (req, res) => {
    // Get destination from config
    const dest = (0, proxy_config_1.default)(req.headers.host);
    // handle error if destination is not configured
    if (!dest) {
        res.statusCode = 404;
        res.end(`Not Found for ${req.headers.host}`);
        return;
    }
    // Prepare config for proxy request
    const { dest_hostname, dest_port } = dest;
    const options = {
        hostname: dest_hostname,
        port: dest_port,
        path: req.url,
        method: req.method,
        headers: req.headers
    };
    // Create proxy request
    const proxy_req = http_1.default.request(options, (proxy_res) => {
        // Handle proxy response
        res.writeHead(proxy_res.statusCode || 500, proxy_res.headers);
        proxy_res.pipe(res, {
            end: true
        });
    });
    // Forward client request to destination
    req.pipe(proxy_req, {
        end: true
    });
    proxy_req.on("error", (error) => {
        console.log("\x1b[31m%s\x1b[0m", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
    });
};
