const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function zipfile(inputPath,outputPath,callback) {
    const gzip = zlib.createGzip();
    const inputFile = fs.createReadStream(inputPath);
    const outputFile = fs.createWriteStream(outputPath+'.gz');
    const end = inputFile.pipe(gzip).pipe(outputFile);
    end.on('error',(err)=>{
        console.log(err);
        callback(err,null);
    });
    end.on('close',()=>{
        callback(null,outputPath+'.gz');
    });
}

module.exports = {
    zipfile    
}