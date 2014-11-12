var fs = require('fs');

var sources = {};

fs.readdirSync(__dirname).forEach(function (source) {
    var domains;

    if (/^index\.js$/.test(source)) {
        return;
    }

    domains = [];
    source = require(__dirname + '/' + source);

    if (Array.isArray(source.domain)) {
        Array.prototype.push.apply(domains, source.domain);
    } else {
        domains.push(source.domain);
    }

    domains.forEach(function (domain) {
        sources[domain] = source.sight;
    });
});

module.exports = sources;
