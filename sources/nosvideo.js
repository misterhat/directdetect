var cheerio = require('cheerio'),
    localeval = require('localeval'),
    needle = require('needle');

module.exports.domain = 'nosvideo.com';

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
            rand: '',
            referer: '',
            usr_login: '',
            method_free: 'Continue to Video',
            method_premium: ''
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

            player = player.match(/playlist=(.+?)&/);

            if (!player) {
                return done(new Error('No playlist found.'));
            }

            needle.get(player[1], options, function (err, res, body) {
                var file;

                if (err) {
                    return done(err);
                }

                try {
                    file = body.playlist.trackList.track.file;
                } catch (e) {
                    return done(e);
                }

                done(null, file);
            });
        });
    });
};
