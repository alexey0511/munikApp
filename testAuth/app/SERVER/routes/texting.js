var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});


router.route('/smsquery')
        .post(function (req, res) {
            var click = require('clickatell');
            var me = req.body.me;
            var apiId = req.body.apiId;
            var pwd = req.body.pwd;
            var msgId = req.body.msgId;
            var sender = click.Clickatell({user: me, api_id: apiId, password: pwd});
            var mId = msgId;
            sender.query(mId, function (result) {
                res.send(result);
            });
        });
router.route('/smssendtxt')
        .post(function (req, res) {
            var click = require('clickatell');
            var me = req.body.me;
            var apiId = req.body.apiId;
            var pwd = req.body.pwd;
            var phone = req.body.to;
            var text = req.body.text;
            var sender = click.Clickatell({user: me, api_id: apiId, password: pwd});
            sender.send(phone, text, function (result) {
                var mId = result.substr(4);
                sender.query(mId, function (data) {
                });
                res.send(result);
            });
        });

module.exports = router;