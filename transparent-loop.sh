#!/usr/bin/env bash

for i in {1..10} ; do echo -n -- $i --  ; ./transparent-report.sh ; sleep 60; done

