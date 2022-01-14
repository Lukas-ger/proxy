module.exports = {
    ports: {
        proxyServer: 81,
        httpserver: 80
    },
    pattern: {
        ports: new RegExp('^[0-9]{1,5}$') // Valid ports
    },
    outTimeout: 30000, // (in ms) for outgoing proxy requests
    inTimeout: 30000, // (in ms) for incoming requests
}