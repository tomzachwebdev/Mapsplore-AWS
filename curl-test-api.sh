#!/bin/bash
#post request to get combined data
curl -X POST -H "x-api-key: k1hc3AeZl8o6HMAjlJAeazZSHO8TEMaR96Aru613" \
--header "Content-Type: application/json" \
--data '{"lat":40.6125658,"long":-73.9070706}' \
https://8wm236gv0l.execute-api.us-east-1.amazonaws.com/Combined-Data/get-combined-data?=apikey
