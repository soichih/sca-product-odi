#!/bin/bash

module load nodejs
(cd $SCA_SERVICE_DIR && npm install)

mkdir -p exps bias flat dark

time node $SCA_SERVICE_DIR/import
