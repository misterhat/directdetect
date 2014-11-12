var needle = require('needle');

module.exports.domain = 'vidzi.tv';

module.exports.sight = function (url, options, done) {
    needle.get(url, options, function (err, res, body) {
        var player;

        if (err) {
            return done(err);
        }

        if (!body) {
            return done(new Error('No body returned.'));
        }

        player = body.match(
            /file:[\s+]?[\"|\'](.+?)[\"|\']\s/
        );

        if (player) {
            player = player[1];
            player = needle.get(player, options);

            return done(null, player);
        }

        done();
    });
};
