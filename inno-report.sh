#!/usr/bin/env bash

pushd .
cd inno-download-sound
for a in * ; do echo -n $a ::  ; ls $a/*word*.mp3 | wc -l ; done
popd

