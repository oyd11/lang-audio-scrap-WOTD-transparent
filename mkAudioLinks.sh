#!/usr/bin/env bash

cd ./transparent-sound/
for lang in * 
do
    cd ../transparent-playlists
    ln -s ../transparent-sound/$lang $lang
done

