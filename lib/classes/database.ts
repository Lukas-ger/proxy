import { RowDataPacket } from "mysql2";

export class Destination {
    host: string | undefined
    port: number | undefined
}

export class ProxyRule {
    destination: Destination | undefined
    action: number | undefined

    constructor(db_entry: RowDataPacket) {
        this.destination = {
            host: db_entry.dest_host,
            port: db_entry.dest_port
        }
        this.action = db_entry.action
    }
}