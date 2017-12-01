#!/usr/bin/env bash

for l in  download/* ;do ll=`basename $l`; node ./cat-phrases-to-md.js $ll ; done


