import http from "http"
import "dotenv"
import { config } from "dotenv"
import request_handler from "./lib/requestHandler"

config()
const { PORT } = process.env

http.createServer(request_handler).listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})