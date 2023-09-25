export class Config {
    src_hostname: string
    dest_hostname: string
    dest_port: number

    constructor(
        src_hostname: string,
        dest_hostname: string,
        dest_port: number
    ) {
        this.src_hostname = src_hostname
        this.dest_hostname = dest_hostname
        this.dest_port = dest_port
    }
}
export default (hostname: string | undefined): Config | null => {


    return null
}