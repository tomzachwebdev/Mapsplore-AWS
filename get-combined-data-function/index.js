// const { Client } = require('pg')
const { Pool } = require('pg')

const queries = require("./queries")
// const client = new Client();
// const client = new Client({
//   user: 'postgres',
//   host: 'postgres-test.coarc7do0vwk.us-east-1.rds.amazonaws.com',
//   database: 'mta_data',
//   password: '12345678',
//   port: 5432,
// });

exports.handler = async function(event, context) {
  console.log("console string")
  const lat = Number(event.lat);
  const long = Number(event.long);
  const deviceID = event.deviceID;
  if(deviceID !== undefined){
    console.log("deviceID: " + deviceID);
  }

  return runQuerry(lat,long);
}


async function runQuerry(lat,long){
  const pool = new Pool({
    user: 'postgres',
    host: 'postgres-test.coarc7do0vwk.us-east-1.rds.amazonaws.com',
    database: 'mta_data',
    password: '12345678',
    port: 5432,
  });


  return pool.connect().then(client => {
     return client.query(queries.closestQuery,[lat,long]).then((res) => {
     client.release()
     return {
      body:res.rows,
      statusCode:200,
      error: null
      };
   }).catch(error => {
     client.release()
     console.log(error.stack)
     return {
      // body:err,
      body: null,
      statusCode:404,
      error: String(error)
      }
   })
}).catch((error) => {
  console.log("error connecting to pool: " + error);
  return {
    body: null,
    statusCode: 404,
    error: String(error)
  }
}).finally(()=>{
   pool.end();
})
}

