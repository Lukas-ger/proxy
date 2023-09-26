import { ProxyRule } from "./Database"

class ProxyCache {
    entries: ProxyRule[] = []

    resolve = (
        req_host: string | undefined
    ): ProxyRule | undefined => {
        return this.entries.find((e: ProxyRule): boolean => e.destination?.host === req_host)
    }

    register = (
        proxy_rule: ProxyRule
    ): void => {
        this.entries.push(proxy_rule)
        if (proxy_rule.cache_time > 0) setTimeout((): void => {
            this.entries.splice(this.entries.indexOf(proxy_rule), 1)
        }, proxy_rule.cache_time * 1000)
    }
}

export default new ProxyCache()