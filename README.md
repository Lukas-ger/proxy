# Getting started

1. Clone this repo
2. Create a `config.json` with following content:
```
{
    "database": "mongodb+srv://admin:<password>@cluster0.716qv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" 
}
```
3. Replace the URL with your database
4. Run `node .`

# Model
| Name | Meaning | Example |
| ------------------ | ------------------ | ------------------ |
| `uri` | The Domain (+ subdomain) | `www.flamex.dev` |
| `target` | The target to be redirected to | `https://discord-botlist.eu` |
| `type` | The type of entry | `REDIRECT` or `WEB` |
| `holdPath` | `www.flamex.dev/foo/bar` -> `https://discord-botlist.eu/foo/bar` | `true` |
| `active` | `true` = `on` / `false` = `off` | `true` |

`REDIRECT`: The user will be redirected to the URL in `target`
`WEB`: The user will see the website in `target` (`http://localhost:PORT`)

**Using cloudflare is recommended**