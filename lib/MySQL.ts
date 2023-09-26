import { MySQLConnection } from "./classes/MySQLConnection";
import { config } from "dotenv"
config()

if (!process.env.MYSQL_HOST) throw new Error("No host for MySQL connection provided")
if (!process.env.MYSQL_USER) throw new Error("No user for MySQL connection provided")
if (!process.env.MYSQL_DB) throw new Error("No database for MySQL connection provided")

export default new MySQLConnection(
    process.env.MYSQL_HOST,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASS,
    process.env.MYSQL_DB
)