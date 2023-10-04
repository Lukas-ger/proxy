import mysql from "../MySQL"
import { IncomingMessage } from "http"

/**
 * Log object for incoming proxy requests
 */
export class Log {
    requested_host: string
    family: number
    ip: string | undefined
    timestamp: Date

    constructor(req: IncomingMessage) {
        this.requested_host = req.headers.host || "UNKNOWN"
        this.family = req.socket.remoteFamily ? parseInt(req.socket.remoteFamily[3]) : 0
        this.ip = req.socket.remoteAddress
        this.timestamp = new Date()

        mysql.insert_log(this)
    }
}