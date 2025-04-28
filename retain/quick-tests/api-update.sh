#!/bin/bash
curl -X PUT "http://localhost:8080/api/kanji/update" \
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

