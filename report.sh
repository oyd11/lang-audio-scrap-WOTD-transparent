#!/usr/bin/env bash

pushd .
cd download
for a in * ; do echo -n $a ::  ; ls $a/sound/*.mp3 | wc -l ; done
popd
