const http = require('http')
const httpProxy = require('http-proxy')
const fs = require("fs")
const { greenBright } = require("chalk")

const proxy = httpProxy.createProxyServer({
  proxyTimeout: 30000,
  timeout: 30000,
  ws: true
}).listen(81)

proxy.on('error', function (err, req, res) {
  res.writeHead(500)
  res.end()
})

http.createServer(async function(req, res, head) {
  const target = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, "utf-8"))[req.headers.host]

  switch (target?.type) {
    case "WEB":
      proxy.web(req, res, {
        target: `http://127.0.0.1:${target.target}`
      })
    break

    case "WS":
      proxy.ws(req, res.socket, head, {
        target: `ws://127.0.0.1:${target.target}`
      })
    break

    case "REDIRECT":
      res.writeHead(302, {
        'Location': target.target
      })
      res.end()
    break

    default:
      res.writeHead(404)
      res.end()
    break
  }
}).listen(80, () => console.log(greenBright("Running on post 80")))