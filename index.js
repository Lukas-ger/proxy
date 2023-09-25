"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
require("dotenv");
const dotenv_1 = require("dotenv");
const requestHandler_1 = __importDefault(require("./lib/requestHandler"));
(0, dotenv_1.config)();
const { PORT } = process.env;
http_1.default.createServer(requestHandler_1.default).listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
