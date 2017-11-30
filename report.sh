#!/usr/bin/env bash

for a in download/* ; do echo $a ; ls $a/sound/*.mp3 | wc -l ; done
