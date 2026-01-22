const gulp     = require("gulp");
const GulpSass = require("gulp-sass")(require("sass"));
const vfl      = require("./vfl");

function build()
{
    let stream = gulp.src("../css/[^_]*.scss")
                    .pipe(GulpSass.sync({ style: "compressed" }).on("error", GulpSass.logError))
                    .pipe(vfl.gulp("s/cssbin"))
                    .pipe(gulp.dest("../../s/cssbin/"));
    stream.on("end", vfl.writeMappings);
    return stream;
}

module.exports = build;