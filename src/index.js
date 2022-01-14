const http = require('http')
const fs = require("fs")
const { greenBright } = require("chalk")
const { ports, pattern } = require("./config")
const proxyServer = require("./handler/proxyServer")
const onError = require("./handler/onError")

// Check for valid ports
if (!pattern.ports.test(ports.proxyServer)) throw new TypeError('The proxyServer port needs to be type of "number"')
if (!pattern.ports.test(ports.httpServer)) throw new TypeError('The httpServer port needs to be type of "number"')

// Register handler & start proxy server
proxy.on('error', onError)
http.createServer(proxyServer).listen(ports.httpServer, () => {
  console.log(greenBright(`Proxy is running on port ${ports.httpServer}`))
})