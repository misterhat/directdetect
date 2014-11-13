var parse = require('url').parse,
    querystring = require('querystring'),

    needle = require('needle');

function findVariable(name, body) {
    var variable = body.match(
        new RegExp('\\.' + name + '=(?:[ ]+)?[\'|"]?(.+?)[\'|"]?;')
    );

    if (!variable) {
        return;
    }

    return variable[1];
}

module.exports.domain = [ 'videoweed.es', 'novamov.com' ];

module.exports.sight = function (url, options, done) {
    var domain = parse(url).hostname,
        id;

    if (/embed\.php/.test(url)) {
        id = querystring.parse(url.slice(url.indexOf('?') + 1)).v;

        url = 'http://' + domain + '/file/' + id;
    }

    needle.get(url, options, function (err, res, body) {
        var file, key, cid, player;

        if (err) {
            return done(err);
        }

        file = findVariable('file', body);
        key = findVariable('filekey', body);
        cid = findVariable('cid', body);

        player = 'http://' + domain + '/api/player.api.php';

        needle.request('get', player, {
            cid: cid,
            key: key,
            file: file
        }, options, function (err, res, body) {
            if (err) {
                return done(err);
            }

            player = querystring.parse(body).url;

            if (!player) {
                return done(new Error('No player URL found.'));
            }

            player = needle.get(player, options);

            done(null, player);
        });
    });
};
