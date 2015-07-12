var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
router.route('/dbservice')
        .post(function (req, res) {
            var request = req.body.request;
//    var username = req.body.user.username;
            var authClient = "abc";
            var authServer = authClient;
            var dbReady = new db.DbService({DbId: 'FZppyrqd2WJkyAr7bLk0LVGbpD6Mug0L', DbPath: '/api/1/databases/hwhl_dev/collections/'});
            var success = function (result) {
                res.send(result);
            };
            if (authServer === authClient) {
                switch (request) {
                    case "create":
                        var table = req.body.table;
                        var record = req.body.record;
                        dbReady.create(table, record, success);
                        break;
                    case "getRecord":
                        var table = req.body.table;
                        var id = req.body.id;
                        dbReady.getRecord(table, id, success);
                        break;
                    case "findRecord":
                        var table = req.body.table;
                        var attrs = req.body.query;
                        dbReady.findRecord(table, attrs, success);
                        break;
                    case "getAll":
                        var table = req.body.table;
                        dbReady.getAll(table, function (result) {
                            res.send(result);
                        });
                        break;
                    case "update":
                        // NOTE: ID always string ( in DB should be strings for valid camparason)
                        var table = req.body.table;
                        var id = req.body.id;
                        var attrs = req.body.attrs;
                        dbReady.updateRecord(table, id, attrs, success);
                        break;
                    case "delete":
                        var attrs = '{username:"' + username + '"}';
                        dbReady.findRecord('users', attrs, function (user) {
                            console.log(user);
                            if (user[0].role == '1') {
                                var id = req.body.id;
                                var table = req.body.table;
                                console.log("DELETE");
                                dbReady.deleteRecord(table, id, success);
                            }
                        });
                        break;
                    default:
                        res.send("Illigal request");
                        break;
                }
            }
        });
module.exports = router;


var db = {
    DbService: function (appConfig) {

        var https = require('https');
        var host = 'api.mongolab.com';
        var endpoint = '';
        var method = 'GET';
        function getAll(table, success) {
            var method = "GET";
            var data = {"apiKey": appConfig.DbId};
            var endpoint = appConfig.DbPath + table;
            sendRequest(endpoint, method, data, success);
        }
        ;
        function create(table, record, success) {
            var method = "POST";
            var endpoint = appConfig.DbPath + table + "?apiKey=" + appConfig.DbId;
            sendRequest(endpoint, method, record, success);
        }
        ;
        function deleteRecord(table, id, success) {
            if (typeof (id) !== 'undefined') {
                var method = "DELETE";
                var endpoint = appConfig.DbPath + table + "/" + id + "?apiKey=" + appConfig.DbId;
                console.log("delete", endpoint);
                var data = {};
                sendRequest(endpoint, method, data, success);
            }
        }
        ;
        function findRecord(table, query, success) {
            var method = "GET";
            var endpoint = appConfig.DbPath + table;
            var data = {'q': query, 'apiKey': appConfig.DbId};
            sendRequest(endpoint, method, data, success);
        }
        ;
        function login(query, success) {
            var method = "GET";
            var endpoint = appConfig.DbPath + "users";
            var a = JSON.stringify(query);
            var data = {'q': a, 'apiKey': appConfig.DbId};
            sendRequest(endpoint, method, data, success);
        }
        ;
        function getRecord(table, id, success) {
            var method = "GET";
            var data = {"apiKey": appConfig.DbId};
            var endpoint = appConfig.DbPath + table + "/" + id;
            sendRequest(endpoint, method, data, success);
        }
        ;
        function updateRecord(table, id, attrs, success) {
            var method = "PUT";
            var endpoint = appConfig.DbPath + table + "/" + id + "?apiKey=" + appConfig.DbId;
            sendRequest(endpoint, method, attrs, success);
        }
        ;
        function sendRequest(endpoint, method, data, success) {
            var querystring = require('querystring');
            var https = require('https');
            var host = 'api.mongolab.com';
            var dataString = JSON.stringify(data);
            var headers = {};
            if (method == 'GET') {
                if (data !== {}) {
                    console.log(data);
                    endpoint += '?' + querystring.stringify(data);
                }
            }
            else {
                headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': dataString.length
                };
            }
            console.log("s", endpoint, "datastring", dataString);
            var options = {
                host: host,
                path: endpoint,
                method: method,
                headers: headers
            };
            var req = https.request(options, function (res) {
                res.setEncoding('utf-8');
                var responseString = '';
                res.on('data', function (data) {
                    responseString += data;
                });
                res.on('end', function () {
                    var responseObject = JSON.parse(responseString);
                    success(responseObject);
                });
            });
            req.write(dataString);
            req.end();
        }
        ;
    }
};
                