var fs = require('fs');
var PNG = require('pngjs').PNG;
var { Base64Encode } = require('base64-stream');

const LIMIT = 2048;

fs.createReadStream('font.png')
    .pipe(new PNG())
    .on("parsed", function () {
        for (var i = 0; i < LIMIT; i++) {

            var image = new PNG({ width: 8, height: 16 });
            var row = Math.floor(i / 32) * 16;
            var col = (i % 32) * 8;
            this.bitblt(image, col, row, 8, 16, 0, 0);

            const out = fs.createWriteStream('chars/' + i + '.txt');
            const encoder = new Base64Encode();

            image.pack().pipe(encoder).pipe(out);
        }
    });

console.log('[');

for (var i = 0; i < LIMIT; i++) {
    const code = fs.readFileSync('chars/' + i + '.txt');
    console.log(`"${code}"${i + 1 == LIMIT ? '' : ','}`)
}

console.log(']');