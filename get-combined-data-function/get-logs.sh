# !/bin/bash
aws lambda invoke --function-name get-combined-data  --cli-binary-format raw-in-base64-out --payload '{"lat": 40.6125658, "long": -73.9070706}' out
sed -i'' -e 's/"//g' out
sleep 15
aws logs get-log-events --log-group-name /aws/lambda/get-combined-data --log-stream-name $(cat out) --limit 5
# aws lambda invoke --function-name get-combined-data \
#     --invocation-type Event \
#     --cli-binary-format raw-in-base64-out \
#     --payload '{"lat": 40.6125658, "long": -73.9070706}' reponse