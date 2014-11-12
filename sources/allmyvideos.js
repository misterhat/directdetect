var cheerio = require('cheerio'),
    needle = require('needle');

module.exports.domain = [ 'vidspot.net', 'allmyvideos.net' ];

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
            method_free: '1'
        };

        form.id = $('input[name="id"]').attr('value');
        form.fname = $('input[name="fname"]').attr('value');

        needle.post(url, form, options, function (err, res, body) {
            var files, file, i;

            if (err) {
                return done(err);
            }

            files = body.match(/\"file\" : \"(.+?)\"/g);

            if (!files) {
                return done(new Error('No files found.'));
            }

            for (i = 0; i < files.length; i += 1) {
                if (/\.mp4/.test(files[i])) {
                    file = files[i].trim().slice(0, -1);
                    file = file.replace('"file" : "', '');

                    file = needle.get(file, options);

                    return done(null, file);
                }
            }

            done();
        });
    });
};
