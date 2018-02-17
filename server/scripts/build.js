#!/usr/bin/env node

// "build": "rimraf dist && mkdirp dist && babel app.js -d dist",

const path = require('path'),
    fs = require('fs-extra'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    babel = require('babel-core'),
    Promise = require('bluebird')
    ;

const dist = path.resolve(__dirname, '..', 'dist'),
    public = path.resolve(__dirname, '..', 'public'),
    client = path.resolve(__dirname, '..', 'client'),
    appjs = path.resolve(__dirname, '..', 'app.js')
    ;

function rm_dist() {
    return (
        new Promise((resolve, reject) => {
            if (!fs.existsSync(dist)) {
                resolve();
            } else {
                rimraf(dist, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
            }
        })
    );
}

function create_dist() {
    return (
        new Promise((resolve, reject) => {
            if (fs.existsSync(dist)) {
                resolve();
            } else {
                mkdirp(dist, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
            }
        })
    );
}

function copy_dirs() {
    return (
        new Promise((resolve, reject) => {
            fs.copy(public, dist)
            .then(() => {
                return fs.copy(client, dist);
            })
            .then(resolve)
            .catch(reject)
            ;
        })
    );
}

function babilify() {
    return (
        new Promise((resolve, reject) => {
            babel.transformFile(appjs, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
    );
}

function create_indexjs(code) {
    return (
        new Promise((resolve, reject) => {
            fs.writeFile(path.resolve(dist, 'index.js'), code, {
                encoding: 'utf8'
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    );
}

if (require.main === module) {
    console.log('Removing dist ...');
    rm_dist()
    .then(() => {
        console.log('Creating dist ...');
        return create_dist();
    })
    .then(() => {
        console.log('Compiling JS ...');
        return babilify();
    })
    .then((result) => {
        console.log('Writing generated code ... ');
        return create_indexjs(result.code);
    })
    .then(() => {
        console.log('Copying folders to dist ...');
        return copy_dirs();
    })
    .catch((err) => {
        console.log(err);
    })
}
