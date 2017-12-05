#!/usr/bin/env bash

pushd .
cd transparent-download/
for a in * ; do echo -n $a ::  ; ls $a/$a-sound/*.mp3 | wc -l ; done
popd
