#!/bin/env node
'use strict';

var request = require('request');
var fs = require('fs');

var config = require(process.cwd()+'/config.json');

//var url = config.odi_api.url;
//var jwt = conodi_api.jwt;

//request.post(config.odi_api.url+"/
var product = {exposures: []};

var source = "/N/dc2/scratch/odiuser/SPIE_in";

for(var id in config.exposures) {
    var logical_id = config.exposures[id];
    fs.symlinkSync(source+"/"+logical_id, id);
    product.exposures.push(id);
}

fs.writeFile('products.json', JSON.stringify([product]), function(err) {
    if(err) throw err;
    console.log("wrote products.json");
});

//config.exposure_ids


