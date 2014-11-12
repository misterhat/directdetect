var cheerio = require('cheerio'),
    needle = require('needle'),
    localeval = require('localeval');

module.exports.domain = 'thefile.me';

module.exports.sight = function (url, options, done) {
    needle.get(url, options, function (err, res, body) {
        var $, form;

        if (err) {
            return done(err);
        }

        try {
            $ = cheerio.load(body);
        } catch (e) {
            return done(e);
        }

        form = {
            op: 'download1',
            usr_login: '',
            referer: '',
            method_free: 'Free Download'
        };

        form.id = $('input[name="id"]').attr('value');
        form.fname = $('input[name="fname"]').attr('value');

        needle.post(url, form, options, function (err, res, body) {
            var $, player;

            if (err) {
                return done(err);
            }

            try {
                $ = cheerio.load(body);
            } catch (e) {
                return done(e);
            }

            player = $('#player_code > script').text() || '';
            player = player.trim().replace('eval(', '').slice(0, -1);

            try {
                player = localeval('(' + player + ')');
            } catch (e) {
                return done(e);
            }

            player = body.match(/file:(?:[ ]+)?["|'](.+?)["|']/);

            if (player) {
                player = player[1];
                player = needle.get(player, options);

                return done(null, player);
            }

            done();
        });
    });
};
