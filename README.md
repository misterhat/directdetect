# directdetect
Turn a variety of video-hosting website links into playable video streams.

Currently `directdetect` supports the following websites:
```javascript
[ 'vidspot.net', 'allmyvideos.net', 'gorillavid.in', 'daclips.in',
  'vodlocker.com', 'royalvids.eu', 'nosvideo.com', 'promptfile.com',
  'sharerepo.com', 'sharesix.com', 'filenuke.com', 'thefile.me', 'videoweed.es',
  'novamov.com', 'vidzi.tv', 'zalaa.com', 'uploadc.com' ]
```

## Installation
For the module:
    $ npm install directdetect

The command-line program:
    $ npm install -g directdetect

## Examples
```javascript
var fs = require('fs');
var directdetect = require('directdetect');

var link = 'http://guerrillavid.in/f94k31d3';

if (directdetect.test(link)) {
    directdetect(link).pipe(fs.createWriteStream('test.mp4'));
}
```

## API
### directdetect(link, [options])
Find the direct download link and download it as a readable stream. You can
normally expect an MP4 with H264, but don't count on it.

`options` is an optional argument that if provided, is passed into the *needle*
request functions. This is provided for a convenient method to change the
browser's user agent or add an HTTP proxy.

### directdetect.test(link)
Check if *directdetect* has a handler for your video link or not. Returns a
boolean `true`/`false` value.

### directdetect.sources
An array of the hosts *directdetect* supports.

## CLI
```
    Usage: directdetect <link> [options]
            <link> being a supported video-hosting website.

            -h, --help      Display this screen.

            -t, --test      If <link> is provided, return true/false
                            depending if directdetect is able to
                            stream the link or not. Otherwise, list the
                            available video-hosting websites.

            -o file         Output video contents to specified file.
            -s, --stdout    Dump video contents to stdout.
```

### Examples
    $ directdetect http://guerrillavid.in/f94k31d3 -o ./out.mp4
    $ directdetect http://guerrillavid.in/f94k31d3 --stdout | mplayer --cache 8192 -

## License
MIT
