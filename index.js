/**
 * Slack plugin
 *
 * Notifies all events (up, down, paused, restarted) by slack message
 *
 * Installation
 * ------------
 * This plugin is uninstalled by default. To install and enable it, git clone
 * the plugin repo and add its entry
 * to the `plugins` folder under uptime
 *
 *   $ git clone git@github.com:waltzofpearls/uptime-plugin-slack.git slack
 *
 * to the `plugins` key of the configuration:
 *
 *   // in config/production.yaml
 *   plugins:
 *     - ./plugins/slack
 *
 * Usage
 * -----
 * This plugin sends an message to slack each time a check is started, goes down,
 * or goes back up. When the check goes down, the message contains the error details:
 *
 *   Object: [Down] Check "FooBar" just went down
 *   On Thursday, September 4th 1986 8:30 PM,
 *   a test on URL "http://foobar.com" failed with the following error:
 *
 *     Error 500
 *
 *   Uptime won't send anymore messages about this check until it goes back up.
 *
 * Configuration
 * -------------
 * Here is an example configuration:
 *
 *   // in config/production.yaml
 *   slack:
 *     webhook: [slack webhook url]
 *     channel: '[slack channel name]' # default '#general'
 *     username: [slack username] # default 'Uptime Alert'
 *     icon_emoji: [emoji icon for [username]] # default ':turtle:'
 *     icon_url: [optional, icon_url for [username]] # default empty, icon_url overrides icon_emoji
 *     event:
 *       up:        true
 *       down:      true
 *       paused:    false
 *       restarted: false
 */

var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var https = require('https');
var moment = require('moment');
var CheckEvent = require('../../models/checkEvent');

exports.initWebApp = function(options) {
    var config = options.config.slack;
    var templateDir = __dirname + '/views/';
    var matches = config.webhook.match(/(http|https):\/\/([^\/]+)(\/.*)?/);

    if (matches === null) {
        return console.error('Problem parsing Slack Webhook URL: ' + config.webhook);
    }

    var httpOpts = {
        host: matches[2],
        path: matches[3] || '/',
        method: 'POST'
    };

    CheckEvent.on('afterInsert', function(checkEvent) {
        if (!config.event[checkEvent.message]) {
            return;
        }
        checkEvent.findCheck(function(err, check) {
            if (err) {
                return console.error(err);
            }
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
                channel: config.channel || '#general',
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
            )(httpOpts, function(res) {
                if (res.statusCode == 200) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log('Slack plugin response data: ' + chunk);
                        console.log('Notified event by slack: Check ' + check.name + ' ' + checkEvent.message);
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

    console.log('Enabled Slack notifications');
}
