#!/usr/bin/env bash

declare -a langs=(
    "Afrikaans" "Arabic" "Bulgarian" "Cantonese" "Chinese" "Croatian" "Czech" "Danish"
    "Dutch"  "Farsi" "Filipino" "Finnish" "French" "German"
    "Greek" "Hebrew" "Hindi" "Hungarian" "Indonesian" "Italian" "Japanese" "Korean"
    "Malaysian" "Mongolian" "Nepali" "Norwegian" "Persian" "Polish" "Portuguese_Brazil"
    "Portuguese" "Romanian" "Russian" "Spanish" "Spanish_Mexican" "Swahili" "Swedish"
    "Thai" "Turkish" "Ukrainian" "Urdu" "Vietnamese"
)

for l in "${langs[@]}"
do
    set -v
    echo "XXX $l XXX"
    node inno-date-iterate.js $l
    set +v
done


