#!/usr/bin/env bash

pushd .
cd inno-download
for a in * ; do echo -n $a ::  ; ls $a/$a-sound/*word*.mp3 | wc -l ; done
popd

