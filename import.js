#!/bin/env node
'use strict';

var request = require('request');
var fs = require('fs');
var async = require('async');
var child_process = require('child_process');
var mongoose = require('mongoose');

var config = require(process.cwd()+'/config.json');

var product = {exps: [], dark: null, flat: null, bias: null};
var source = "/N/dc2/scratch/odiuser/SPIE_in";

/* symlink
for(var id in config.exposures) {
    var logical_id = config.exposures[id];
    fs.symlinkSync(source+"/"+logical_id, id);
    product.exposures.push(id);
}
*/

var Exposure = mongoose.model('Exposure', new mongoose.Schema(
{
    logical_id: String, //like b20121107T155331.1
    type: String, //bias, flat, dark, object, focus, etc..
    headers: mongoose.Schema.Types.Mixed,
    comments: mongoose.Schema.Types.Mixed,
}));

mongoose.connect('mongodb://soichi7.ppa.iu.edu:27018/odi');
var db = mongoose.connection;
db.on('error', function(err) {
    throw err;
});

function copy(src, dest, cb) {
    //TODO - to validation to make sure user specified valid src/dest..
    console.log("rsync-ing from odiuser@karst:"+src+" to "+dest);
    //child_process.exec('scp -r -i ~/.ssh/odiuser.id_rsa odiuser@karst.uits.iu.edu:'+src+' '+dest, {stdio:[0,1,2]}, function(err, stdout, stderr) {
    child_process.exec('rsync -avz -e "ssh -i '+process.env.HOME+'/.ssh/odiuser.id_rsa" odiuser@karst.uits.iu.edu:'+src+'/ '+dest, function(err, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });   
}

db.once('open', function() {
    async.series([
        function(next) {
            if(!config.bias) return next();

            console.log("handling bias:"+config.bias);
            Exposure.findById(config.bias, function(err, exp) {
                if(err) return next(err);
                if(!exp) return next("couldn't find such bias:"+config.bias);
                //var exp = JSON.stringify(exp);
                var exp = exp.toObject(); //without this, I can't access _cache
                //console.log(JSON.stringify(exp, null, 4));
                //console.log(exp._id);
                //console.log(exp.type);
                //console.log(exp._cache);
                copy(exp._cache, "bias/"+exp.logical_id, function(err) {
                    if(err) return next(err);
                    product.bias = exp._id;
                    next();
                });
            });
        }, 
        function(next) {
            if(!config.flat) return next();

            console.log("handling flat:"+config.bias);
            Exposure.findById(config.flat, function(err, exp) {
                if(err) return next(err);
                var exp = exp.toObject(); //without this, I can't access _cache
                copy(exp._cache, "flat/"+exp.logical_id, function(err) {
                    if(err) return next(err);
                    product.flat = exp._id;
                    next();
                });
            });
        }, 
        function(next) {
            if(!config.dark) return next();

            console.log("handling dark:"+config.bias);
            Exposure.findById(config.dark, function(err, exp) {
                if(err) return next(err);
                var exp = exp.toObject(); //without this, I can't access _cache
                copy(exp._cache, "dark/"+exp.logical_id, function(err) {
                    if(err) return next(err);
                    product.dark = exp._id;
                    next();
                });
            });
       }, 
        function(next) {
            //handle exposures
            async.eachSeries(config.exps, function(id, next_exp) {
                console.log("handling exposure:"+id);
                Exposure.findById(id, function(err, exp) {
                    if(err) return next_exp(err);
                    copy("/N/dc2/scratch/odiuser/SPIE_in/"+exp.logical_id, "exps/"+exp.logical_id, function(err) {
                        if(err) return next_exp(err);
                        product.exps.push(id);
                        next_exp();
                    });
                });
            }, next);
        }, 
    ], function(err) {
        if(err) throw err;
        fs.writeFile('products.json', JSON.stringify([product]), function(err) {
            if(err) throw err;
            console.log("wrote products.json");
            db.close();
        });
    });

});


