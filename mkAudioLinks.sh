#!/usr/bin/env bash

mkdir ./transparent-playlists
mkdir ./transparent-html

cd ./transparent-sound/
for lang in * 
do
    cd ../transparent-playlists
    ln -s ../transparent-sound/$lang $lang
    cd ../transparent-html/
    ln -s ../transparent-sound/$lang $lang
done

