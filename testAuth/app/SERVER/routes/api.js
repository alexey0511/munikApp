var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var bodyParserJson = bodyParser.json();
db = require('../dbService');




router.route('/me')
        .get(function (req, res) {
            // get user from JWT and give readable value to the user
            res.json({
                user: req.user.username,
                role: req.user.role
            });
        })
router.route('/getClients')
        .get(function (req, res) {
            // get user from JWT and give readable value to the user
            db.getAll("clients", function (result) {
                res.json(result);
            });
        });


module.exports = router;



