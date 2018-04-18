#!/usr/bin/env bash

echo "everything transparent in one script"
echo "----------"
echo "----------"

set -v
 ./transparent-all-langs.sh
echo "----------"
echo "----------"
./transparent-all-md.sh > transparent.md.log &
./transparent-mk-html.jl > transparent.html.log &

echo "----------"
wait
echo "----------"

