const cors = require('cors')
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const path = require('path');
global.appRoot = path.resolve(__dirname);
const consola = require('consola')
const port = process.env.PORT || 8080;
const router = express.Router();
const api = require(`${appRoot}/api`)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.use(function(req, res, next) {
  consola.info({
    message: `${req.method} request from ${req.hostname} [${req.ip}]`,
    badge: true
  })
  consola.info({
    message: `Body: ${JSON.stringify(req.body)}`
  })
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', function(req, res ) {
  res.statusMessage = "Access via this method is forbidden.";
  res.status(403).end();
})

app.use('/', router)
api.start(app)
app.listen(port);
consola.ready({
  message: `Server listening on port ${port}`,
  badge: true
})
