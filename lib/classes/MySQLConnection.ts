import {
    Connection,
    createConnection,
    QueryError,
    RowDataPacket
} from "mysql2";
import { ProxyRule } from "./Database"
import proxy_cache from "./Cache"

export class MySQLConnection {
    connection: Connection
    host: string
    user: string
    database: string

    constructor(
        host: string,
        user: string,
        password: string | undefined,
        database: string
    ) {
        this.host = host
        this.user = user
        this.database = database
        this.connection = createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        })
    }

    connect = async (): Promise<void> => {
        return new Promise((resolve, reject): void => {
            this.connection?.connect((err: QueryError | null): void => {
                if (err) return reject(err)
                resolve()
            })
        })
    }

    get_proxy_rule = async (
        req_host: string | undefined
    ): Promise<ProxyRule | undefined> => {
        return new Promise((resolve): void => {
            if (proxy_cache.resolve(req_host)) return resolve(proxy_cache.resolve(req_host))

            this.connection?.query(
                "SELECT r.*, GROUP_CONCAT(b.ip SEPARATOR ';') AS blacklisted_ips FROM rules r LEFT JOIN blacklist b ON r.req_host = b.req_host WHERE r.req_host = ? GROUP BY r.req_host",
                req_host,
                (
                    err: QueryError | null,
                    results: RowDataPacket[]
                ): void => {
                    if (err) throw err
                    if (results[0]) {
                        const result: ProxyRule = new ProxyRule(results[0])
                        proxy_cache.register(result)
                        resolve(result)
                    } else {
                        resolve(undefined)
                    }
                }
            )
        })
    }
}