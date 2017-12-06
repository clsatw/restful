curl -H "Content-Type: application/json" -X POST -d '{"balance": 100, "name":"checking"}'  "http://ajoan.com:3000/accounts" 
curl -H 'Content-Type: application/json' -X PUT -d '{"balance": 200, "name": "savings"}'  "http://ajoan.com:3000/accounts/{ID}" 
curl "http://ajoan.com:3000/accounts" 
curl -X DELETE "http://ajoan.com:3000/accounts/{ID}" y