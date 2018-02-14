#!/usr/bin/env bash

target=$1
lang=$2
echo Target: ${target}
echo lang: ${lang}

mkdir -p ${target}/transparent-download/
mkdir -p ${target}/transparent-html/
mkdir -p ${target}/transparent-output/
mkdir -p ${target}/transparent-sound/

echo copying ${lang} jsons:
cp -r transparent-download/${lang}/ ${target}/transparent-download/${lang}/
cp -r transparent-output/${lang}/ ${target}/transparent-output/${lang}/
echo copying ${lang} html:
cp -r transparent-html/${lang}.html ${target}/transparent-html/
cp -r transparent-html/${lang}_all.js ${target}/transparent-html/
cp -r transparent-html/all.html ${target}/transparent-html/
cp -r transparent-html/dark.css ${target}/transparent-html/
echo copying ${lang}-sound:
cp -r transparent-sound/${lang}-sound/ ${target}/transparent-sound/${lang}-sound/

