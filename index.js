const http = require('http')
const httpProxy = require('http-proxy')
const { greenBright } = require("chalk")
const { ports, outTimeout, inTimeout, hosts, response_with_error } = require("./config.json")

// Create the proxy server
const server = httpProxy.createProxyServer({
  proxyTimeout: outTimeout,
  timeout: inTimeout,
  ws: true
}).listen(ports.proxy_server)

// Error occured
server.on('error', (err, req, res) => {
  res?.writeHead(500, response_with_error ? err : undefined)
  res?.end()
})

http.createServer(async (req, res, head) => {
  // Return status code 404 if host is not a registered target
  if (!hosts[req.headers.host]) {
    res.writeHead(404)
    return res.end()
  }

  // Get details about the registered target
  const { type, target } = hosts[req.headers.host]

  switch (type) {
    // HTTP requests
    case 0:
      server.web(req, res, {
        target: `http://127.0.0.1:${target}`
      })
    break

    case 1:
      // WebSocket requests
      server.ws(req, res.socket, head, {
        target: `ws://127.0.0.1:${target}`
      })
    break

    case 2:
      // Redirections
      res.writeHead(302, {
        'Location': target
      })
      res.end()
    break

    default:
      /**
       * Error
       * Non-existent target type
       */
      res.writeHead(502, "Non-existent target type")
      res.end()
    break
  }
}).listen(ports.http_server, () => {
  console.log(greenBright(`HTTP is running on port ${ports.http_server}`))
  console.log(greenBright(`Proxy is running on port ${ports.proxy_server}`))
})