#!/bin/bash
zip -r user-report-function.zip . 
aws lambda update-function-code --function-name user-report-function \
--zip-file fileb://user-report-function.zip