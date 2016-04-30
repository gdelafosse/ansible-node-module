#! node

'use strict';

const fs = require('fs');
const util = require('util');

const argsReg = /(\w+)="(\w+)"/g;

function readArguments() {
    return new Promise((resolve, reject) => {
        fs.readFile(process.argv[2], (err, data) => {
            if (err) {
                reject(err);
            }
            
            const content = data.toString('utf-8');
            let args = {};
            let matching;
            while((matching = argsReg.exec(content)) != null) {
                args[matching[1]] = matching[2];
            }
            resolve(args);
        });
    });
}

function main(callback) {
    return readArguments()
        .then(callback)
        .then((result) => {
            if (util.isNullOrUndefined(result)) {
                console.log('{}');
            } else {
                console.log(JSON.stringify(result));
            }
        })
        .catch((err) => {
            console.log(`{"failed":true, "msg":"${err.message}"}`);
            throw err;
        });
}

module.exports = {
    main
};
