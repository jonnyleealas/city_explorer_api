
'use strict'
const superagent = require('superagent')
// The name of the library that is going to create the server : express
const express = require('express');
const cors = require('cors');
const app = express();
const pg = require('pg');
app.use(cors());
// dotenv lets us get our secrets from our .env file
require('dotenv').config();


const PORT = process.env.PORT || 3001;
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error("ERROR first " ,err));
client.connect();
app.get('/location', (request, response) => {
  let city = request.query.city.toLowerCase().trim();
  let queryString = `SELECT * FROM locations WHERE search_query = '${city}';`

  client.query(queryString).then((res) => {
    if (res.rows.length > 0) {
      let finalObj = new Location(city, res.rows[0]);
      return response.status(200).send(finalObj);
    } else {
      let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ}&q=${city}&format=json`;
      superagent.get(url).then(resultsFromSuperAgent => {
        let objectToSave = {
          search_query: resultsFromSuperAgent.body[0].display_name.split(",")[0].toLowerCase().trim(),
          formatted_query: resultsFromSuperAgent.body[0].display_name.split(",")[3].toLowerCase().trim(),
          longitude: resultsFromSuperAgent.body[0].lon,
          latitude: resultsFromSuperAgent.body[0].lat
        }
        let finalObj = new Location(city, objectToSave);
        /// ...finalobj three dots spread the variables into a thing
        let safeValues = [finalObj.search_query, finalObj.formatted_query, finalObj.latitude, finalObj.longitude];
        let sqlQuery = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1,$2,$3,$4);';
        client.query(sqlQuery, safeValues)
          .then(() => {
            return response.status(200).send(finalObj);
          })
          .catch(e => {
            throw e;
          });
      });
    }
  })
    .catch(err => {
      throw err;
    });
});



function Location (search_query, obj) {
  this.search_query = search_query;
  this.formatted_query = obj.formatted_query;
  this.latitude = obj.latitude;
  this.longitude = obj.longitude;
}


//WEATHER
app.get('/weather', (request, response) => {
  let search_query = request.query.search_query;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${search_query}&key=${process.env.WEATHER_BIT}`;
  superagent.get(url)
    .then(resultsFromSuperAgent => {
      let weatherResult = resultsFromSuperAgent.body.data.map(day =>{
        return new Weather(day);
      })
      response.status(200).send(weatherResult);
    }).catch(err => console.log("ERROR in weather" ,err));
})
function Weather(obj){
  this.forecast = obj.weather.description;
  this.time = obj.valid_date;
  // array.push(this);
}


//HIKING
app.get('/trails', (request, response) => {
  try{
    let latitude = request.query.latitude;
    let longitude = request.query.longitude;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAIL_API_KEY}`;
    superagent.get(url)
      .then(resultsFromSuperAgent => {
        let hikingResults = resultsFromSuperAgent.body.trails.map(hike => new Hiking(hike));
        response.status(200).send(hikingResults);
      }).catch(err => {
        console.log(err)
      })
  } catch(err) {
    // console.log("ERROR2 " ,err);
    response.status(500).send('Not Working!');
  }
})
function Hiking(obj) {
  this.name=obj.name;
  this.location=obj.location;
  this.length=obj.length;
  this.stars=obj.stars;
  this.star_votes=obj.starVotes;
  this.summary=obj.summary;
  this.trail_url=obj.url;
  this.conditions=`${obj.conditionDetails || ''} ${obj.conditionStatus}`;
  this.conditions_date=obj.conditionDate.slice(0, obj.conditionDate.indexOf(' '));
  this.conditions_time=obj.conditionDate.slice(obj.conditionDate.indexOf(' ')+1, obj.conditionDate.length);
}

app.get('*', (request, response) => {
  response.status(404).send('sorry!')
})

// start the server or turn on the server or calling the server we must do this dont forget to do this dont forget to start port by using app.listen
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);

})