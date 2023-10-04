import
    http, {
    ClientRequest,
    IncomingMessage,
    ServerResponse
} from "http"
import mysql from "./MySQL"
import { ProxyRule } from "./classes/ProxyRule"
import { Log } from "./classes/Log"

const { get_proxy_rule } = mysql

/**
 * Check if the request and be forwarded without conflicts
 */
const pre_checks = async (
    req: IncomingMessage,
    res: ServerResponse
): Promise<void> => {
    // No requested host in headers provided
    if (!req.headers.host) {
        res.statusCode = 400
        res.end("No host in headers")
        return
    }

    const proxy_rule: ProxyRule | undefined = await get_proxy_rule(req.headers.host)

    // No rule for requested destination configured
    if (!proxy_rule) {
        res.statusCode = 404
        res.end(`Not Found for ${req.headers.host}`)
        return
    }

    // IP blacklisted
    if (req.socket.remoteAddress && proxy_rule.blacklist_src.includes(req.socket.remoteAddress)) {
        res.statusCode = 403
        res.end("Access denied")
        return
    }

    // No method provided
    if (!req.method) {
        res.statusCode = 400
        res.end("No method provided")
        return
    }

    req.headers["Via"] = `${req.httpVersion} InternalProxy`

    // Forward the request to the configured destination
    forward_request(req, res, proxy_rule)

    // Log request if enabled
    if (proxy_rule.logging) new Log(req)
}

/**
 * Forward the full and conflict free request to its destination
 */
const forward_request = (
    req: IncomingMessage,
    res: ServerResponse,
    proxy_rule: ProxyRule
): void => {
    const proxy_req: ClientRequest = http.request({
        hostname: proxy_rule.destination?.host,
        port: proxy_rule.destination?.port,
        path: req.url || "/",
        method: req.method,
        headers: req.headers
    }, (dest_res: IncomingMessage): void => {
        if (!dest_res.statusCode) {
            proxy_req.emit("error", "The destination responded without a status code")
            return
        }

        res.writeHead(dest_res.statusCode, dest_res.headers)

        // Forward the destinations response to the client
        dest_res.pipe(res, {
            end: true
        })
    })

    // Forward client request to destination
    req.pipe(proxy_req, {
        end: true
    })

    // Handle request errors
    proxy_req.on("error", (error: Error): void => {
        console.error(new Date(), error)
        res.statusCode = 500
        res.end("Internal Server Error")
    })
}

export default pre_checks