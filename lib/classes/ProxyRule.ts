import { RowDataPacket } from "mysql2"
import { Destination } from "../interfaces/Destination"

/**
 * A rule for the proxy
 */
export class ProxyRule {
    requested_host: string
    destination: Destination
    action: number
    cache_time: number
    blacklist_src: string[]
    logging: boolean

    constructor(db_entry: RowDataPacket) {
        this.requested_host = db_entry.req_host
        this.destination = {
            host: db_entry.dest_host,
            port: db_entry.dest_port
        }
        this.action = db_entry.action
        this.cache_time = db_entry.cache_time
        this.blacklist_src = db_entry.blacklisted_ips?.split(";") || []
        this.logging = !!db_entry.logging.readInt8()
    }
}