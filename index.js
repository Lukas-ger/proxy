/**
 * © Flamex 2023 - MIT License (see "LICENSE" file)
 */

/**
 * This proxy script supports requests for HTTP and WS requests.
 * Incoming requests will be sent to 127.0.0.1 with the configured port or redirected to the given URL.
 * You can configure them in the config.json file.
 *
 * "type" is the type of the action regarding the incoming request (see below).
 * "target" is either the port (type 0 and 2: int) or the URL (type 1: string).
 */

/**
 * The different types of targets and their meanings are...
 *
 * 0 = HTTP request (port as int)
 * 1 = Redirect (url as string)
 * 2 = WS request (port as int)
 */

const http = require('http')
const httpProxy = require('http-proxy')
const fs = require("fs")
const path = require("path")
const { ports, outTimeout, inTimeout, response_with_error, allowWebSockets } = require("./config.json")

// Create the proxy server
const server = httpProxy.createProxyServer({
  proxyTimeout: outTimeout,
  timeout: inTimeout,
  ws: allowWebSockets
}).listen(ports.proxy_server)

// Error occured
server.on('error', (err, req, res) => {
  res?.writeHead(500, response_with_error ? err : "Internal Server Error")
  res?.end()
})

http.createServer(async (req, res, head) => {
  // Read the configured hosts from config.json
  const hosts = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"))).hosts

  // Return status code 404 if host is not a registered target
  if (!hosts[req.headers.host]) {
    res.writeHead(404, response_with_error ? "Not found" : undefined)
    return res.end()
  }

  // Get details about the registered target
  const { type, target } = hosts[req.headers.host]

  // Do the action regarding the configured type
  switch (type) {
    // HTTP requests
    case 0:
      server.web(req, res, {
        target: `http://127.0.0.1:${target}`
      })
    break

    case 1:
      // Redirections
      res.writeHead(302, {
        'Location': target
      })
      res.end()
      break

    case 2:
      // WebSocket requests
      server.ws(req, res.socket, head, {
        target: `ws://127.0.0.1:${target}`
      })
    break

    default:
      // Error: Non-existent target type
      res.writeHead(502, "Non-existent target type. Please contact the administrator of this website.")
      res.end()
    break
  }
}).listen(ports.http_server, () => {
  console.log(`HTTP server is running on port ${ports.http_server}`)
  console.log(`Proxy server is running on port ${ports.proxy_server}`)
})