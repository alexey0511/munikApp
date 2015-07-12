var express, expressJwt,
        app, secret, port, env,
        authentication, texting, apiRoute;

env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

express = require("express");
expressJwt = require('express-jwt');

app = express();
secret = "TheAnswerIs42";

app.all('*', function (req, res, next) {
    // TODO : restrict to white list domains
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if ('OPTIONS' == req.method) {
        return res.send(200);
    }
    next();
});
app.use(express.static("../public"));

authentication = require('./routes/authenticate');
app.use('/authenticate', authentication);

texting = require('./routes/texting');
app.use('/texting', texting);

apiRoute = require('./routes/api');
app.use('/api', expressJwt({secret: secret}));
app.use('/api', apiRoute);

port = Number(process.env.PORT || 5001);
app.listen(port, function () {
    console.log("Listening on " + port);
});
