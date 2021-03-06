
var dbService = (function () {
    var appConfig = {
        DbId: 'FZppyrqd2WJkyAr7bLk0LVGbpD6Mug0L',
        DbPath: '/api/1/databases/hwhl_dev/collections/'
    };
    function getAll(table, success) {
        var method = "GET";
        var data = {"apiKey": appConfig.DbId};
        var endpoint = appConfig.DbPath + table;
        sendRequest(endpoint, method, data, success);
    }
    function create(table, record, success) {
        var method = "POST";
        var endpoint = appConfig.DbPath + table + "?apiKey=" + appConfig.DbId;
        sendRequest(endpoint, method, record, success);
    }
    function deleteRecord(table, id, success) {
        if (typeof (id) !== 'undefined') {
            var method = "DELETE";
            var endpoint = appConfig.DbPath + table + "/" + id + "?apiKey=" + appConfig.DbId;
            console.log("delete", endpoint);
            var data = {};
            sendRequest(endpoint, method, data, success);
        }
    }
    function findRecord(table, query, success) {
        var method = "GET";
        var endpoint = appConfig.DbPath + table;
        var data = {'q': query, 'apiKey': appConfig.DbId};
        sendRequest(endpoint, method, data, success);
    }
    function login(query, success) {
        var method = "GET";
        var endpoint = appConfig.DbPath + "users";
        var a = JSON.stringify(query);
        var data = {'q': a, 'apiKey': appConfig.DbId};
        sendRequest(endpoint, method, data, success);
    }
    function getRecord(table, id, success) {
        var method = "GET";
        var data = {"apiKey": appConfig.DbId};
        var endpoint = appConfig.DbPath + table + "/" + id;
        sendRequest(endpoint, method, data, success);
    }

    function updateRecord(table, id, attrs, success) {
        var method = "PUT";
        var endpoint = appConfig.DbPath + table + "/" + id + "?apiKey=" + appConfig.DbId;
        sendRequest(endpoint, method, attrs, success);
    }
    function sendRequest(endpoint, method, data, success) {
        var querystring = require('querystring');
        var https = require('https');

        var host = 'api.mongolab.com';

        var dataString = JSON.stringify(data);
        var headers = {};
        if (method === 'GET') {
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
    return {
        getAll: getAll,
        create: create,
        deleteRecord: deleteRecord,
        findRecord: findRecord,
        getRecord: getRecord,
        updateRecord: updateRecord,
        login: login
    };
})();


module.exports = dbService;
