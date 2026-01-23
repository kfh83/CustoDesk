const gulp     = require("gulp");
const GulpSass = require("gulp-sass")(require("sass"));
const vfl      = require("./vfl");
const ImgBuild = require("./img_build");

function buildInternal()
{
    let stream = gulp.src("../css/[^_]*.scss")
                    .pipe(GulpSass.sync({ style: "compressed" }).on("error", GulpSass.logError))
                    .pipe(vfl.gulp("s/cssbin"))
                    .pipe(gulp.dest("../../s/cssbin/"));
    stream.on("end", vfl.writeMappings);
    return stream;
}

function build()
{
    return gulp.series(ImgBuild, buildInternal)();
}

module.exports = build;