
var ejs = require('ejs');
var http = require('http');
var https = require('https');
var moment = require('moment');
var CheckEvent = require('../../models/checkEvent');

// https://hooks.slack.com/services/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

exports.initWebApp = function(options) {
    var config = options.config.slack;

    CheckEvent.on('afterInsert', function(checkEvent) {
        if (!config.event[checkEvent.message]) {
            return;
        }
        checkEvent.findCheck(function(err, check) {
            if (err) {
                return console.error(err);
            }
            var matches = config.url.match(/(http|https):\/\/([^\/]+)(\/.*)?/);
            if (matches === null) {
                return console.error('Problem with URL config: ' + config.url);
            }
            var options = {
                host: matches[2],
                path: matches[3] || '/',
                method: 'POST'
            };
            var filename = templateDir + checkEvent.message + '.ejs';
            var renderOptions = {
                check: check,
                checkEvent: checkEvent,
                url: options.config.url,
                moment: moment,
                filename: filename
            };
            var lines = ejs.render(fs.readFileSync(filename, 'utf8'), renderOptions).split('\n');
            var postdata = {
                channel: config.channel || '#dev',
                username: config.username || 'Uptime Alert',
                text: lines.join('\n'),
                icon_emoji: config.icon_emoji || ':turtle:'
            }
            if (config.icon_url) {
                delete postdata.icon_emoji;
                postdata.icon_url = config.icon_url;
            }
            var req = (
                matches[1] == 'https' ? https.request : http.request
            )(options, function(res) {
                if (res.statusCode == 200) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log('Slack plugin response data: ' + chunk);
                    });
                } else {
                    console.error('Slack plugin response code: ' + res.statusCode);
                    console.error('Slack plugin response headers: ' + JSON.stringify(res.headers));
                }
            });
            req.on('error', function(_err) {
                console.error('Slack plugin response error: ' + _err.message);
            });
            req.write(JSON.stringify(postdata));
            req.end();
        });
    });

    console.log('Enabled Email notifications');
}
