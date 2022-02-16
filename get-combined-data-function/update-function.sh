#!/bin/bash
zip -r get-combined-data.zip . 
aws lambda update-function-code --function-name get-combined-data \
--zip-file fileb://get-combined-data.zip