#!/bin/bash
echo ''
echo "Checking for entry with key 'one':"
jq '.[] | select(.key == "one")' ../src/main/resources/Heisig.json


