<h1 align="center">P R O X Y</h1>

__Beta - This version might not work as it's supposed to do__

Basic proxy script using <a href="https://github.com/http-party/node-http-proxy">http-proxy</a>

## Setup
1. Clone this repository
2. Adapt the `config.json` to your usage
3. Run the script

__Inline command example for Linux__:<br>
`git clone https://github.com/flamexdev/proxy.git && cd proxy && node .`

## Target modification
To modify or add your own target you need to enter the `config.json` file. The allowed types are...
0 = Basic HTTP request (target is the port as int)
1 = Websocket request (target is the port as int)
2 = Redirect (target is the url as string)

## Any questions left?
Feel free to open a issue, send me an [E-Mail](mailto:contact@flamex.dev) or a dm on [Discord](https://discord.com/users/681424352599736327)