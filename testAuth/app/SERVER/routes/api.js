var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var bodyParserJson = bodyParser.json();



router.route('/me')
        .get(function (req, res) {
            // get user from JWT and give readable value to the user
            res.json({
                user: req.user.username
            });
        })


module.exports = router;



