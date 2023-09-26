import {
    Connection,
    createConnection,
    QueryError,
    RowDataPacket
} from "mysql2";
import { ProxyRule } from "./Database"
import proxy_cache from "./Cache"

/**
 * The connection to the MySQL database
 */
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

    /**
     * Create and initialize the connection with the MySQL database.
     */
    connect = async (): Promise<void> => {
        return new Promise((resolve, reject): void => {
            this.connection?.connect((err: QueryError | null): void => {
                if (err) return reject(err)
                resolve()
            })
        })
    }

    /**
     * Get the rule of the proxy rule either from cache or MySQL database
     */
    get_proxy_rule = async (
        req_host: string | undefined
    ): Promise<ProxyRule | undefined> => {
        return new Promise((resolve): void => {
            // Get rule from cache
            if (proxy_cache.resolve(req_host)) return resolve(proxy_cache.resolve(req_host))

            // Get rule from MySQL database
            this.connection?.query(
                "SELECT r.*, GROUP_CONCAT(b.ip SEPARATOR ';') AS blacklisted_ips FROM rules r LEFT JOIN blacklist b ON r.req_host = b.req_host WHERE r.req_host = ? GROUP BY r.req_host",
                req_host,
                (
                    err: QueryError | null,
                    results: RowDataPacket[]
                ): void => {
                    if (err) throw err

                    // Register rule in cache if possible
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