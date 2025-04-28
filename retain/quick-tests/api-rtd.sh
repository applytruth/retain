#!/bin/bash
curl -X GET "https://app.rtd-denver.com/route/93L/schedule?serviceType=2&direction=Northbound&branch=" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "one",
    "number": 1,
    "chapter": 1,
    "strokes": 5,
    "story": "The story for one"
  }'
echo ''
echo "Checking for entry with key 'one':"
jq '.[] | select(.key == "one")' ../src/main/resources/Heisig.json

