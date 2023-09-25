import
    http, {
    ClientRequest,
    IncomingMessage,
    ServerResponse
} from "http"
import mysql from "./mysql"
import { ProxyRule } from "./classes/database"

const { get_proxy_rule } = mysql

export default async (
    req: IncomingMessage,
    res: ServerResponse
): Promise<void> => {
    const proxy_rule: ProxyRule | undefined = await get_proxy_rule(req.headers.host)

    // handle error if destination is not configured
    if (!proxy_rule) {
        res.statusCode = 404
        res.end(`Not Found for ${req.headers.host}`)
        return
    }

    // Prepare config for proxy request
    const options = {
        hostname: proxy_rule.destination?.host,
        port: proxy_rule.destination?.port,
        path: req.url,
        method: req.method,
        headers: req.headers
    }

    // Create proxy request
    const proxy_req: ClientRequest = http.request(options, (proxy_res: IncomingMessage): void => {
        // Handle proxy response
        res.writeHead(proxy_res.statusCode || 500, proxy_res.headers)
        proxy_res.pipe(res, {
            end: true
        })
    })

    // Forward client request to destination
    req.pipe(proxy_req, {
        end: true
    })

    proxy_req.on("error", (error: Error) => {
        console.error(error)
        res.statusCode = 500
        res.end("Internal Server Error")
    })
}