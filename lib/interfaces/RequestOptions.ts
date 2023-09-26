import { IncomingHttpHeaders } from "http"

export interface RequestOptions {
    hostname: string
    port: string
    path: string
    method: string | undefined
    headers: IncomingHttpHeaders
}