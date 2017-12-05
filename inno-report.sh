#!/usr/bin/env bash

pushd .
cd inno-download-sound
for a in * ; do 
    if [[ -d $a ]]; then
        echo -n $a ::  
        ls $a/*word*.mp3 | wc -l 
    fi
done

popd

