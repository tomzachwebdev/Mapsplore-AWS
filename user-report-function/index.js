"use strict";
const { Pool } = require('pg')
// const pool = new Pool()
const { Client } = require('pg')
const queries = require("./queries")
// const client = new Client();
// const client = new Client({
//   user: 'postgres',
//   host: 'postgres-test.coarc7do0vwk.us-east-1.rds.amazonaws.com',
//   database: 'mta_data',
//   password: '12345678',
//   port: 5432,
// });

const pool = new Pool({
  user: 'postgres',
  host: 'postgres-test.coarc7do0vwk.us-east-1.rds.amazonaws.com',
  database: 'mta_data',
  password: '12345678',
  port: 5432,
});

const Sizes = {
  small:"small",
  medium:"medium",
  large:"large"
}

exports.handler = async function(event, context) {
   const id = event.deviceID;
   const lat = Number(event.lat);
   const long = Number(event.long);
   const epochTime = Number(event.time);
   const crowdSize = event.crowdSize;
   const areaSize = event.areaSize;
   
   const crowd_estimation = createEstimation(areaSize);
   const area_estimation = createEstimation(areaSize);
   event.crowd_estimation = crowd_estimation
   event.area_estimation = area_estimation
  
   const data = [id, lat, long, epochTime, crowdSize, areaSize, crowd_estimation, area_estimation]
   return runQuerry(data);

}


async function runQuerry(data){
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })


  return pool.connect().then(client => {
      //  return client.query('SELECT $1::text as message', ['Hello world!']).then(res => {
        return pool.connect().then(client => {
            return client.query(query, data).then(res => {
                client.release()
                return {
                  body:res.rows,
                  statusCode:200
                };
              }).catch(err => {
                client.release()
                console.log(err.stack)
                return {
                  body:err,
                  statusCode:404
                };
              })
        })
      }).finally(()=>{
          pool.end();
        })
  




  // await client.connect()
  // // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
  // const res = await client.query(queries.closestQuery)//query('SELECT * FROM daily_counts_2020 LIMIT 10;');
  // console.log(res.rows[0].message); // Hello world!
  // await client.end();
  // return res.rows;
}


//basic estimation
function createEstimation(size){

  switch(size){
    case Sizes.small:
      return 5;
    case Sizes.medium:
      return 25;
    case Sizes.large:
      return 75;
  }

}

const query = `
  INSERT INTO user_reports (user_id, latitude, longitude,
  time, crowdSize, areaSize,
  crowd_estimation, area_estimation) 
  VALUES ($1::text, $2::numeric,$3::numeric,
  to_timestamp($4::numeric)::timestamp,$5::text,$6::text,$7::numeric,$8::numeric);
`
