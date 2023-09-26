import { RowDataPacket } from "mysql2";

export class Destination {
    host: string
    port: string

    constructor(
        host: string,
        port: string
    ) {
        this.host = host
        this.port = port
    }
}

export class ProxyRule {
    destination: Destination
    action: number
    cache_time: number
    blacklist_src: string[]

    constructor(db_entry: RowDataPacket) {
        this.destination = new Destination(
            db_entry.dest_host,
            db_entry.dest_port
        )
        this.action = db_entry.action
        this.cache_time = db_entry.cache_time
        this.blacklist_src = db_entry.blacklisted_ips?.split(";") || []
    }
}