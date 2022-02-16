#!/bin/bash
aws lambda invoke --function-name user-report-function  out
sed -i'' -e 's/"//g' out
sleep 15
aws logs get-log-events --log-group-name /aws/lambda/user-report-function --log-stream-name $(cat out) --limit 5