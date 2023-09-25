import { Mysql } from "./classes/mysql";
import { config } from "dotenv"
config()

export default new Mysql(
    process.env.MYSQL_HOST,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASS,
    process.env.MYSQL_DB
)