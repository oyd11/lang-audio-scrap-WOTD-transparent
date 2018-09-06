#!/usr/bin/env bash

pushd .
cd transparent-sound/
for a in * ; do echo -n $a ::  ; ls $a/*.mp3 | wc -l ; done
popd
