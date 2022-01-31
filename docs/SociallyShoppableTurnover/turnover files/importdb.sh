#!/bin/bash
for filename in *.json; do
        f=$(echo "$filename"| cut -f 1 -d '.')
        mongoimport --db ss --collection  "$f" --file "$filename"
done