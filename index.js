var url = require('url'),
    stream = require('stream'),

    sources = require('./sources');

function parse(link) {
    var domain = url.parse(link).hostname || '';
    domain = domain.replace('www.', '');

    return domain;
}

function test(link) {
    return !!sources[parse(link)];
}

function fetch(link, options, done) {
    var domain = parse(link);

    if (!done) {
        done = options;
        options = {};
    }

    if (!test(link)) {
        return done(new Error('No handler found for "' + domain + '".'));
    }

    sources[domain](link, options, done);
}

function download(link) {
    var out = new stream.PassThrough();

    fetch(link, function (err, direct) {
        if (err) {
            return out.emit('error', err);
        }

        if (!direct) {
            return out.emit('error', new Error('No direct link found.'));
        }

        direct.pipe(out);
    });

    return out;
}

module.exports = download;
module.exports.test = test;
module.exports.sources = Object.keys(sources);
