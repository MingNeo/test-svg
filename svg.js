/*
 *    读取所有文件
 *    合并成一个新文件
 */

const FS = require("fs");
const PATH = require('path');

function svg(fileSource, exportFilePath) {

    const readFiles = [];
    let newFileSize = 0;
    let newFileData = "";
    let mergeFileProgress = 0;
    // let folderIndex = 1;
    // let folderMap = {};

    function searchFile(path) {
        try {
            let stats = FS.statSync(path);
            if (stats.isFile()) {
                newFileSize += stats.size;
                readFiles.push({ absPath: path, size: stats.size });
            } else if (stats.isDirectory()) {
                let dirfiles = FS.readdirSync(path);
                // folderMap[]
                for (let i = 0; i < dirfiles.length; i++) {
                    searchFile(PATH.join(path, dirfiles[i]));
                }
            }
        } catch (err) {
            console.log("error not find " + path);
        }
    }

    for (let i = 0; i < fileSource.length; i++) {
        searchFile(fileSource[i]);
    }
    var eachFolder = function() {
        for (let i = 0; i < readFiles.length; i++) {
            var str = ("" + FS.readFileSync(readFiles[i].absPath))
                .replace(/\"/g, "'").replace(/\r|\n/g, "").replace(/>\s+/g, ">").replace(" version='1.1' id='图层_1'", " class='wqd-svgicon'")
                .replace(" xmlns:xlink='http://www.w3.org/1999/xlink'", "")
                .replace("<!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->", "")
                .replace("<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>", "")
                .replace("<?xml version='1.0' encoding='utf-8'?>", "")
                .replace(/ d='([^\']*)/g, function(m,n){
                    return " " + m.replace(/\n|\r|\s/g,"")
                });
            newFileData += "{\"model\":\"" + str + "\"}"+ (i == readFiles.length - 1 ? "" : ",\r");
            mergeFileProgress++;
            // console.log("读取第" + mergeFileProgress + "个文件。");
        }
    }

    eachFolder();

    FS.writeFile(exportFilePath, newFileData, err => {
        if (null != err) {
            throw err;
        } else {
            console.log("总共合并 " + readFiles.length + "个文件 " + newFileSize + " bytes");
        }
    });
}

svg(["1_日常"], "json.json")
