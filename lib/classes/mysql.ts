import {
    Connection,
    createConnection,
    QueryError,
    RowDataPacket
} from "mysql2";
import { ProxyRule } from "./database"

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
            this.connection?.query(
                "SELECT * FROM rules WHERE req_host = ?",
                req_host,
                (
                    err: QueryError | null,
                    results: RowDataPacket[]
                ): void => {
                    if (err) throw err
                    resolve(
                        results[0] ? new ProxyRule(results[0]) : undefined
                    )
                }
            )
        })
    }
}