var cheerio = require('cheerio'),
    needle = require('needle');

module.exports.domain = 'promptfile.com';

module.exports.sight = function (url, options, done) {
    options.follow = true;

    needle.get(url, options, function (err, res, body) {
        var $, hash;

        if (err) {
            return done(err);
        }

        try {
            $ = cheerio.load(body);
        } catch (e) {
            return done(e);
        }

        hash = $('input[name="chash"]').attr('value');

        if (!hash) {
            return done(null, new Error('Could not find form hash.'));
        }

        needle.post(url, { chash: hash }, options, function (err, res, body) {
            var $, player;

            if (err) {
                return done(err);
            }

            try {
                $ = cheerio.load(body);
            } catch (e) {
                return done(e);
            }

            player = $('.view_dl_link').attr('href') || null;

            if (player) {
                player = needle.get(player, options);
                return done(null, player);
            }

            done();
        });
    });
};
