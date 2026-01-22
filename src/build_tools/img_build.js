const gulp     = require("gulp");
const canvas   = require("canvas");
const through2 = require("through2");
const vfl      = require("./vfl");

let g_imageMap = {};

function writeToImageMap()
{
    return through2.obj(function(file, encoding, cb)
    {
        let imageName = path.basename(file._originalName, path.extname(file._originalName));
        let imagePath = "/s/imgbin/" + path.basename(file.path);
        g_imageMap[imageName] = imagePath;
        cb(null, file);
    });
}

function build()
{
    let imagesStream = gulp.src("../img/*.png")
        .pipe(vfl.gulp("s/imgbin"))
        .pipe(writeToImageMap())
        .pipe(gulp.dest("../../s/imgbin/"));
    
    let sheets = {};
    let sheetsStream = gulp.src("../img/*/*.png")
            .pipe(through2.obj(function(file, encoding, cb)
                {
                    let sheet = path.basename(path.dirname(file.path));
                    sheets[sheet] = sheets[sheet] || [];
                    sheets[sheet].push(file);
                    cb();
                }, 
                function(cb)
                {
                    let tasks = Object.keys(sheets).map(function(sheet)
                    {
                        
                    });
                }))

    return imagesStream;
}

module.exports = build;