var http = require('http');
var httpProxy = require('http-proxy');
const config = require("./config.json")
const mongodb = require('mongoose');
mongodb.set('useFindAndModify', false);

const proxys = mongodb.model("proxies", new mongodb.Schema({
  uri: String,
  target: String,
  type: String,
  holdPath: Boolean,
  active: Boolean
}))

mongodb.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}).then(async () => {
  var proxy = httpProxy.createServer({
    proxyTimeout: 30000,
    timeout: 30000
  }).listen(3001)

  http.createServer(async function(req, res) {
      
    const target = await proxys.findOne({uri: req.headers.host, active: true})

    if (!target) {
      res.writeHead(404);
      return res.end();
    }

    switch (target.type) {
      case "WEB":
        proxy.web(req, res, {
          target: target.target
        });
      break;

      case "REDIRECT":
        res.writeHead(302, {
          'Location': target.holdPath == true ? target.target + req.url : target.target
        });
        res.end();
      break;
    
      default:
        res.writeHead(404);
        res.end();
      break;
    }


  }).listen(80, () => { console.log(`${new Date()} | Proxy started`) });
})