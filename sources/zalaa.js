var cheerio = require('cheerio'),
    needle = require('needle');

module.exports.domain = [ 'zalaa.com', 'uploadc.com' ];

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
            ipcount_val: '10',
            op: 'download2',
            usr_login: '',
            referer: '',
            method_free: 'Continue'
        };

        form.id = $('input[name="id"]').attr('value');
        form.fname = $('input[name="fname"]').attr('value');

        needle.post(url, form, options, function (err, res, body) {
            var player;

            if (err) {
                return done(err);
            }

            if (!body) {
                return done(new Error('No body returned.'));
            }

            player = body.match(
                /\'file\',\'(.+?)\'/
            );

            if (player) {
                player = needle.get(player[1], options);
                return done(null, player);
            }

            done();
        });
    });
};
