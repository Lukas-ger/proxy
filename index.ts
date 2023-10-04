import http from "http"
import request_handler from "./lib/RequestHandler"
import mysql from "./lib/MySQL"
import { QueryError } from "mysql2"
const { PORT } = process.env

if (!PORT) throw Error("No port provided")

/**
 * Start the proxy server
 */
http.createServer(request_handler).listen(PORT, (): void => {
    console.log(`listening on port ${PORT}`)
    mysql.connect()
        .then((): void => {
            console.log(`Connected as '${mysql.user}' to database '${mysql.database}' on '${mysql.host}'`)
        })
        .catch((err: QueryError): void => {
            throw err
        })
})