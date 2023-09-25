import {
    createConnection,
    Connection,
    QueryError
} from "mysql2"
import { config } from "dotenv"
config()

class Mysql {
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
        return new Promise((resolve, reject) => {
            this.connection?.connect((err: QueryError | null): void => {
                if (err) return reject(err)
                resolve()
            })
        })
    }
}

export default new Mysql(
    process.env.MYSQL_HOST,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASS,
    process.env.MYSQL_DB
)