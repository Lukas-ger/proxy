const http = require('http')
const httpProxy = require('http-proxy')
const fs = require("fs")
const { greenBright } = require("chalk")
const hosts = require("./hosts")
const { ports, outTimeout, inTimeout } = require("./config")

if (typeof ports.proxyServer !== "number") throw new TypeError('The proxyServer port needs to be type of "number"')
if (typeof ports.httpServer !== "number") throw new TypeError('The httpServer port needs to be type of "number"')

const proxy = httpProxy.createProxyServer({
  proxyTimeout: outTimeout,
  timeout: inTimeout,
  ws: true
}).listen(ports.proxyServer)

proxy.on('error', (err, req, res) => {
  res.writeHead(500)
  res.end()
})

http.createServer(async (req, res, head) => {
  if (!hosts[req.headers.host]) {
    res.writeHead(404)
    return res.end()
  }

  const { type, target } = hosts[req.headers.host]

  switch (type) {
    case "WEB":
      proxy.web(req, res, {
        target: `http://127.0.0.1:${target}`
      })
    break

    case "WS":
      proxy.ws(req, res.socket, head, {
        target: `ws://127.0.0.1:${target}`
      })
    break

    case "REDIRECT":
      res.writeHead(302, {
        'Location': target
      })
      res.end()
    break

    default:
      res.writeHead(502)
      res.end()
    break
  }
}).listen(ports.httpServer, console.log(greenBright(`Proxy is running on port ${ports.httpServer}`)))