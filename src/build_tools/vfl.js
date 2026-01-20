const GulpRename = require("gulp-rename");
const crypto     = require("crypto");
const Stream     = require("stream");
const path       = require("path");
const fs         = require("fs");

let g_vflMap = {};

function gulp(basePath = "")
{
    let stream = new Stream.Transform({ objectMode: true });
    stream._transform = function(file, encoding, cb)
    {
        let vflHash = crypto
            .createHash("md5")
            .update(file.contents)
            .digest("base64")
            .substring(0, 6)
            .replace(/\+/g, "-")
            .replace(/\//g, "_");

        let extname = path.extname(file.path);
        let basename = path.basename(file.path, extname);
        g_vflMap[`${basePath}/${basename}${extname}`]
            = `${basePath}/${basename}-vfl${vflHash}${extname}`;

        return GulpRename({ suffix: `-vfl${vflHash}` })._transform(file, encoding, cb);
    };
    return stream;
}

function writeMappings()
{
    const MAP_FILE_PATH = "../../vfl.json";
    let vflMap = {};
    try
    {
        let contents = fs.readFileSync(MAP_FILE_PATH).toString();
        vflMap = JSON.parse(contents);
    }
    catch (e) {}

    for (const prop in g_vflMap)
    {
        vflMap[prop] = g_vflMap[prop];
    }

    fs.writeFileSync(MAP_FILE_PATH, JSON.stringify(vflMap));
}

module.exports = { gulp, writeMappings };