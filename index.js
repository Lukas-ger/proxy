const http = require('http')
const httpProxy = require('http-proxy')
const fs = require("fs")

const proxy = httpProxy.createProxyServer({
  proxyTimeout: 30000,
  timeout: 30000,
  ws: true
}).listen(3001)

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/html'
  })

  res.end(`Something went wrong.<br><code>${err.message}</code>`)
})

http.createServer(async function(req, res, head) {
  const target = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, "utf-8"))[req.headers.host]

  switch (target?.type) {
    case "WEB":
      proxy.web(req, res, {
        target: `http://localhost:${target.target}`
      })
    break

    case "WS":
      proxy.ws(req, res.socket, head, {
        target: `ws://localhost:${target.target}`
      })
    break

    case "REDIRECT":
      res.writeHead(302, {
        'Location': target.keepPath ? target.target + req.url : target.target
      })
      res.end()
    break

    default:
      res.writeHead(404, {
        'Content-Type': 'text/html'
      })
      res.end("Something went wrong.<br><code>Page not found</code>")
    break
  }
}).listen(80, () => {
  console.log(`${new Date()} | Proxy started`)
})
