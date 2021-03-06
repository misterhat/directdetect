var cheerio = require('cheerio'),
    needle = require('needle');

module.exports.domain = [
    'gorillavid.in', 'daclips.in', 'royalvids.eu', 'vodlocker.com'
];

module.exports.sight = function (url, options, done) {
    needle.get(url, options, function (err, res, body) {
        var $, form, hash, download;

        if (err) {
            return done(err);
        }

        try {
            $ = cheerio.load(body);
        } catch (e) {
            return done(e);
        }

        form = {
            referer: url,
            rand: '',
            usr_login: '',
            method_free: 'Free Download'
        };

        form.op = $('input[name="op"]').last().attr('value');
        form.id = $('input[name="id"]').attr('value');
        form.fname = $('input[name="fname"]').attr('value');

        hash = $('input[name="hash"]').attr('value');

        if (hash) {
            form.hash = hash;
        }

        download = $('#btn_download');

        if (download) {
            form[download.attr('name')] = download.attr('value');
        } else {
            form.method_free = '1';
        }

        needle.post(url, form, options, function (err, res, body) {
            var body, player;

            if (err) {
                return done(err);
            }

            if (!body) {
                return done(new Error(
                    'Empty body returned with status code ' + res.statusCode +
                    '.'
                ));
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
