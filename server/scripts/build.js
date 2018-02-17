#!/usr/bin/env node

// "build": "rimraf dist && mkdirp dist && babel app.js -d dist",

const path = require('path'),
    fs = require('fs-extra'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    babel = require('babel-core'),
    Promise = require('bluebird')
    ;

function rm_dir(dirPath) {
    return (
        new Promise((resolve, reject) => {
            if (!fs.existsSync(dirPath)) {
                resolve();
            } else {
                rimraf(dirPath, (err) => {
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

function create_dir(dirPath) {
    return (
        new Promise((resolve, reject) => {
            if (fs.existsSync(dirPath)) {
                resolve();
            } else {
                mkdirp(dirPath, (err) => {
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

function copy_dirs(optsArray) {
    return (
        new Promise((resolve, reject) => {
            if (Array.isArray(optsArray) && optsArray.length > 0) {
                const _itr = (_arr) => {
                    let opts = _arr.shift();
                    if (opts) {
                        if (fs.existsSync(opts.dest)) {
                            fs.copy(opts.src, opts.dest)
                            .then(() => {
                                _itr(_arr);
                            })
                            .catch((err) => {
                                reject(err);
                            })
                        } else {
                            create_dir(opts.dest)
                            .then(() => {
                                fs.copy(opts.src, opts.dest)
                                .then(() => {
                                    _itr(_arr);
                                })
                                .catch((err) => {
                                    reject(err);
                                })
                            })
                            .catch((err) => {
                                reject(err);
                            })
                        }
                    } else {
                        resolve();
                    }
                }
                _itr(optsArray);
            } else {
                reject(new Error('Empty options for copy_dirs'));
            }
        })
    );
}

function babilify(filePath) {
    return (
        new Promise((resolve, reject) => {
            babel.transformFile(filePath, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
    );
}

function create_file(code, filePath) {
    return (
        new Promise((resolve, reject) => {
            fs.writeFile(filePath, code, {
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
    let dist = path.resolve(__dirname, '..', 'dist'),
        public = path.resolve(__dirname, '..', 'public'),
        client = path.resolve(__dirname, '..', 'client'),
        appjs = path.resolve(__dirname, '..', 'app.js'),
        indexjs = path.resolve(__dirname, '..', 'dist', 'index.js')
        ;
    console.log('Removing dist ...');
    rm_dir(dist)
    .then(() => {
        console.log('Creating dist ...');
        return create_dir(dist);
    })
    .then(() => {
        console.log('Compiling JS ...');
        return babilify(appjs);
    })
    .then((result) => {
        console.log('Writing generated code ... ');
        return create_file(result.code, indexjs);
    })
    .then(() => {
        console.log('Copying folders to dist ...');
        return copy_dirs([
            {src: public, dest: path.resolve(dist, 'public')},
            {src: client, dest: path.resolve(dist, 'client')},
        ]);
    })
    .catch((err) => {
        console.log(err);
    })
}
