import {
    Connection,
    createConnection,
    QueryError,
    RowDataPacket
} from "mysql2";
import { ProxyRule } from "./database"
import proxy_cache from "./cache"

export class Mysql {
    connection: Connection | undefined
    host: string | undefined
    user: string | undefined
    database: string | undefined

    constructor(
        host: string | undefined,
        user: string | undefined,
        password: string | undefined,
        database: string | undefined
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
                "SELECT * FROM rules WHERE req_host = ?",
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