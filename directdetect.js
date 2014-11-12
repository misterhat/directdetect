#!/usr/bin/env node
var fs = require('fs'),

    directdetect = require('./'),
    minimist = require('minimist'),

    package = require('./package');

var argv = minimist(process.argv.slice(2)),
    link = argv._[0],
    options = {},

    direct;

if (argv.c || argv.check) {
    link = link || argv.check;
    if (link) {
        return console.log(directdetect.test(link));
    }

    return console.log(directdetect.sources.join('\n'));
}

if (!link || argv.h || argv.help) {
    console.log('%s - %s', package.name, package.version);
    console.log(package.description + '\n');

    console.log('Usage: ' + package.name + ' <link> [options]');
    console.log('\t<link> being a video link from a supported host.\n');
    console.log('\t-h, --help\tDisplay this screen.\n');
    console.log('\t-c, --check\tIf <link> is provided, return true/false');
    console.log('\t\t\tdepending if ' + package.name + ' is able to');
    console.log('\t\t\tstream the link or not. Otherwise, list the');
    console.log('\t\t\tavailable video-hosting websites.\n');
    console.log('\t-t, --timeout\tSet a custom timeout for each request. By');
    console.log('\t\t\tdefault the timeout is set to 10.');
    console.log('\t-x proxy\tAn HTTP proxy to send requests with.');
    console.log('\t-a agent\tSet a custom HTTP User-Agent string.\n');
    console.log('\t-o file\t\tOutput video contents to specified file.');
    console.log('\t-s, --stdout\tDump video contents to stdout.\n');
    console.log('Read the README.md file for more information.');

    return process.exit(0);
}

if (!directdetect.test(link)) {
    console.error('No handler found for provided link.');
    return process.exit(1);
}

options.timeout = +(argv.t || argv.timeout) || 10;
options.proxy = argv.x;
options.user_agent = argv.a || argv.agent;

direct = directdetect(link, options);

direct.on('error', function (err) {
    console.error(err.stack);
    process.exit(1);
});

if (argv.s || argv.stdout) {
    direct.pipe(process.stdout);
    return;
}

if (argv.o) {
    direct.pipe(fs.createWriteStream(argv.o));
    return;
}
