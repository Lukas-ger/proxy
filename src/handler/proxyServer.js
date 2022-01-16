const httpProxy = require('http-proxy')
const hosts = require("../hosts.js")
const { ports, outTimeout, inTimeout } = require("../config.js")

const proxy = httpProxy.createProxyServer({
  proxyTimeout: outTimeout,
  timeout: inTimeout,
  ws: true
}).listen(ports.proxyServer)

module.exports = async (req, res, head) => {
    // Return status code 404 if host is not a registered target
    if (!hosts[req.headers.host]) {
      res.writeHead(404)
      return res.end()
    }
  
    // Get details about the registered target
    const { type, target } = hosts[req.headers.host]
  
    switch (type) {
      // HTTP requests
      case "WEB":
        proxy.web(req, res, {
          target: `http://127.0.0.1:${target}`
        })
      break
  
      case "WS":
        // WebSocket requests
        proxy.ws(req, res.socket, head, {
          target: `ws://127.0.0.1:${target}`
        })
      break
  
      case "REDIRECT":
        // Redirections
        res.writeHead(302, {
          'Location': target
        })
        res.end()
      break
  
      default:
        /**
         * Error!
         * Non-existent target type
         */
        res.writeHead(502)
        res.end()
      break
    }
  }