import http from "http"
import "dotenv"
import { config } from "dotenv"
import request_handler from "./lib/request_handler"
import mysql from "./lib/mysql";
import { QueryError } from "mysql2";

config()
const { PORT } = process.env

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