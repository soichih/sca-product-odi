#!/bin/bash

module load nodejs
(cd $SCA_SERVICE_DIR && npm install)

time node $SCA_SERVICE_DIR/import
