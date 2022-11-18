const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router("./db/db.json");
const middlewares = jsonServer.defaults({ noCors: true });
const cors = require('cors');
server.use(jsonServer.bodyParser);
server.use(middlewares);

var whitelist = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3020",
    "http://localhost:3000/*",
    "http://localhost:3020/*",
    "http://127.0.0.1:5174",
    "http://localhost:*"
];

var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        var originIsWhiteListed = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhiteListed);
    },
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: "accept, content-type"
};

server.use(cors(corsOptions));
server.use(router);
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow.methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept, Authorization");
    next();
});

router.render = (req, res) => {
    console.log(req.query);
    res.jsonp({
        "total": res.locals.data.length,
        "limit": 40,
        "skip": 0,
        "data": res.locals.data
    });
};

server.listen(3020, () => {
    console.log("JSON Server is running");
})