
var https = require('https');

var options = {
    hostname: 'hooks.slack.com',
    port: 443,
    path: '/services/T03EH2H3P/B03EH2NRH/zGLLVCqDnoI265x0KXMzOFfN',
    method: 'POST'
};

var req = https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(JSON.stringify({
    channel: '#general',
    username: 'Uptime Bot',
    text: 'Test test test.',
    icon_emoji: ':ghost:'
}));
req.end();
