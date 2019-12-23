#!/usr/bin/env bash

declare -a langs=(
# "arabic"
# "balinese"
# "balinese-indonesian"
# "dari"
# "dutch"
# "english-spanish"
# "english-portuguese"
# "esperanto"
# "french"
# "hebrew"
# "hindi"
# "indonesian"
# "irish"
# "italian"
# "japanese"
# "korean"
# "latin"
# "mandarin"
# "norwegian"
# "swedish"
# "spanish"
 "turkish"
 "polish"
 "portuguese"
 "russian"
 "pashto"
 "urdu"
)

for l in "${langs[@]}"
do
    set -v
    echo "XXX $l XXX"
    node transparent-date-iterate.js $l
    set +v
done


