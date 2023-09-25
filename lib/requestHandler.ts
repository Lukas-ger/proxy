import http, {ClientRequest, IncomingMessage, ServerResponse} from "http";
import proxy_config, { Config } from "./proxy_config";

export default (req: IncomingMessage, res: ServerResponse): void => {
    // Get destination from config
    const dest: Config | null = proxy_config(req.headers.host)

    // handle error if destination is not configured
    if (!dest) {
        res.statusCode = 404
        res.end(`Not Found for ${req.headers.host}`)
        return
    }

    // Prepare config for proxy request
    const { dest_hostname, dest_port } = dest

    const options = {
        hostname: dest_hostname,
        port: dest_port,
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
        console.log("\x1b[31m%s\x1b[0m", error)
        res.statusCode = 500
        res.end("Internal Server Error")
    })
}