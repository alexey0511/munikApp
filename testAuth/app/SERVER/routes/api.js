var express, router, bodyParser, expressJwt, jwt, bodyParserJson,
        db;

express = require('express');
router = express.Router();
bodyParser = require('body-parser');
expressJwt = require('express-jwt');
jwt = require('jsonwebtoken');
bodyParserJson = bodyParser.json();
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
router.route('/getProducts')
        .get(function (req, res) {
            // get user from JWT and give readable value to the user
            db.getAll("products", function (result) {
                res.json(result);
            });
        });
router.route('/getUsers')
        .get(function (req, res) {
            // get user from JWT and give readable value to the user
            db.getAll("users", function (result) {
                                var users = [];
                for (var i=0, l=result.length;i<l;i++) {
                    users.push(result[i].username);
                }
                res.json(users);
            });
        });
router.route('/clients')
        .post(bodyParserJson, function (req, res) {
            // get user from JWT and give readable value to the user
            var success = function (data) {
                data ? res.send(data) : res.status(400).send({message: "Failed to create a record"});
            };
            db.create("clients", req.body, success);
        });
router.route('/visits')
        .post(bodyParserJson, function (req, res) {
            // get user from JWT and give readable value to the user
            var success = function (data) {
                data ? res.send(data) : res.status(400).send({message: "Failed to create a record"});
            };
            db.create("/haircuts", req.body, success);
        });
router.route('/visits/:id')
        .get(function (req, res) {
            // get user from JWT and give readable value to the user
            var success = function (data) {
                data ? res.send(data) : res.status(400).send({message: "Failed retrieve record"});
            };
            db.findRecord("/haircuts", '{"userId": ' + req.param("id") + '}', success);
        });
        
        // potentially replace with update
router.route('/clients/:id')
        .post(bodyParserJson,function (req, res) {
            if (req.param("id") === req.body.id.toString()) {
            console.log("YES");
            // get user from JWT and give readable value to the user
            var success = function (data) {
                data ? res.send(data) : res.status(400).send({message: "Failed retrieve record"});
            };
            db.create("/clients", req.body, success);
        } else {
            console.log("NO",typeof req.param("id"),typeof req.body.id );
        }
        });

module.exports = router;



