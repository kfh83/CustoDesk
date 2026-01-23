const gulp     = require("gulp");
const canvas   = require("canvas");
const through2 = require("through2");
const path     = require("path");
const fs       = require("fs");
const vfl      = require("./vfl");

class GrowingPacker
{
    root = null;

    fit(blocks)
    {
        let len = blocks.length;
        let w = (len > 0) ? blocks[0].w : 0;
        let h = (len > 0) ? blocks[0].h : 0;
        this.root = { x: 0, y: 0, w, h };
        for (let n = 0; n < len; n++)
        {
            let block = blocks[n];
            let node = this.findNode(this.root, block.w, block.h);
            if (node)
                block.fit = this.splitNode(node, block.w, block.h);
            else
                block.fit = this.growNode(block.w, block.h);
        }
    }

    findNode(root, w, h)
    {
        if (root.used)
            return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
        else if ((w <= root.w) && (h <= root.h))
            return root;
        else
            return null;
    }

    splitNode(node, w, h)
    {
        node.used = true;
        node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
        node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
        return node;
    }

    growNode(w, h)
    {
        let canGrowDown  = (w <= this.root.w);
        let canGrowRight = (h <= this.root.h);

        let shouldGrowRight = canGrowRight && (this.root.h >= (this.root.w + w));
        let shouldGrowDown  = canGrowDown  && (this.root.w >= (this.root.h + h));

        if (shouldGrowRight)
            return this.growRight(w, h);
        else if (shouldGrowDown)
            return this.growDown(w, h);
        else if (canGrowRight)
            return this.growRight(w, h);
        else if (canGrowDown)
            return this.growDown(w, h);
        else
            return null;
    }

    growRight(w, h) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w + w,
            h: this.root.h,
            down: this.root,
            right: { x: this.root.w, y: 0, w: w, h: this.root.h }
        };
        let node = this.findNode(this.root, w, h)
        if (node)
            return this.splitNode(node, w, h);
        else
            return null;
    }
    
    growDown(w, h) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w,
            h: this.root.h + h,
            down:  { x: 0, y: this.root.h, w: this.root.w, h: h },
            right: this.root
        };
        let node = this.findNode(this.root, w, h);
        if (node)
            return this.splitNode(node, w, h);
        else
            return null;
    }
}

let g_imageMap = {};
let g_sheetMap = {};

function writeImageSheetMap()
{
    const MAP_FILE_PATH = "../css/_imgmap.scss";

    let fileContents = "$_images: (";
    for (const name in g_imageMap)
    {
        fileContents += "\n";
        fileContents += `    "${name}": "${g_imageMap[name]}",`;
    }
    fileContents += "\n);\n";

    fs.writeFileSync(MAP_FILE_PATH, fileContents);
}

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

function writeToSheetMap()
{

}

function buildSheet()
{
    let images = [];
    
    return through2.obj(function (file, encoding, cb)
    {
        canvas.loadImage(file.path).then(function (image)
        {
            images.push(image);
            cb();
        })
    })
}

function buildImages()
{
    return gulp.src("../img/*.png", { encoding: false })
        .pipe(vfl.gulp("s/imgbin"))
        .pipe(writeToImageMap())
        .pipe(gulp.dest("../../s/imgbin/"));   
}

function buildSheets()
{
    let sheets = {};
    return gulp.src("../img/*/*.png")
        .pipe(through2.obj(function(file, encoding, cb)
            {
                let sheet = path.basename(path.dirname(file.path));
                sheets[sheet] = sheets[sheet] || [];
                sheets[sheet].push(file.path);
                cb();
            }, function(cb)
            {
                let tasks = Object.keys(sheets).map(async function(sheetName)
                {
                    
                });
            }));
}

function build()
{
    let stream = gulp.parallel(buildImages, buildSheets)();
    stream.on("end", writeImageSheetMap);
    return stream;
}

module.exports = build;