import { ProxyRule } from "./ProxyRule"

class ProxyCache {
    entries: ProxyRule[] = []

    /**
     * Get a proxy rule from the cache that matches the requested host.
     */
    resolve = (
        req_host: string
    ): ProxyRule | undefined => {
        return this.entries.find((e: ProxyRule): boolean => e.requested_host === req_host)
    }

    /**
     * Register a rule in the cache. Delete it after the configured time in seconds.
     */
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