var needle = require('needle');

module.exports.domain = [ 'sharesix.com', 'filenuke.com' ];

module.exports.sight = function (url, options, done) {
    needle.post(url, {
        method_free: 'Free'
    }, options, function (err, res, body) {
        var player;

        if (err) {
            return done(err);
        }

        if (!body) {
            return done(new Error('No body returned.'));
        }

        player = body.match(/lnk1\s?=\s?[\'|\"](.+?)[\'|\"]/);

        if (player && player[1]) {
            player = needle.get(player[1], options);

            return done(null, player);
        }

        done();
    });
};
