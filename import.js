#!/bin/env node
'use strict';

var request = require('request');
var fs = require('fs');
var async = require('async');
var child_process = require('child_process');

var config = require(process.cwd()+'/config.json');

//var url = config.odi_api.url;
//var jwt = conodi_api.jwt;

//request.post(config.odi_api.url+"/
var product = {exposures: []};

var source = "/N/dc2/scratch/odiuser/SPIE_in";

/* symlink
for(var id in config.exposures) {
    var logical_id = config.exposures[id];
    fs.symlinkSync(source+"/"+logical_id, id);
    product.exposures.push(id);
}
*/

//ssh from odiuser
async.forEachOf(config.exposures, function(logical_id, id, next) {
    console.log("handling "+logical_id);
    //child_process.execSync('scp -r -i ~/.ssh/odiuser.id_rsa odiuser@dataxfer.bigred2.uits.iu.edu:/N/dc2/scratch/odiuser/SPIE_in/'+logical_id+' '+id, 
    //TODO I should probably use rsync?
    child_process.execSync('scp -r -i ~/.ssh/odiuser.id_rsa odiuser@karst.uits.iu.edu:/N/dc2/scratch/odiuser/SPIE_in/'+logical_id+' '+id, 
        {stdio:[0,1,2]}
    );    
    product.exposures.push(id);
    next();
}, function(err) {
    if(err) throw err;
    fs.writeFile('products.json', JSON.stringify([product]), function(err) {
        if(err) throw err;
        console.log("wrote products.json");
    });
});

//config.exposure_ids


