 eslint-disable no-undef */
'use strict';
// express library sets up our server
const express = require('express');
// initalizes our express library into our variable called app
const app = express();
//SuperAgent
const superagent = require('superagent');
// dotenv lets us get our secrets from our .env file
require('dotenv').config();
// bodyguard of our server - tells who is ok to send data to
const cors = require('cors');
app.use(cors());
// bring in the PORT by using process.env.variable name
const PORT = process.env.PORT || 3001;
//LOCATION
app.get('/location', (request, response) => {
  let city = request.query.city;
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEO_DATA_API_KEY}&q=${city}&format=json`;
  superagent.get(url)
    .then(resultsFromSuperAgent => {
      let finalObj = new Location(city, resultsFromSuperAgent.body[0]);
      response.status(200).send(finalObj);
    })
})
function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.valid_date;
 
}
//WEATHER
app.get('/weather', (request, response) => {
  let search_query = request.query.search_query;
  // console.log('stuff I got from the front end on the weather route', search_query);
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${search_query}&key=${process.env.WEATHER_API_KEY}`;
  superagent.get(url)
    .then(resultsFromSuperAgent => {
      let weatherResult = resultsFromSuperAgent.body.data.map(day =>{
        return new Weather(day);
      })
      response.status(200).send(weatherResult);
    }).catch(err => console.log(err));
})
app.get('*', (request, response) => {
  response.status(404).send('sorry, this route does not exist');
})
app.get('/location', (request, response) => {
  try{
    // query: { city: 'seattle' },
    console.log(request.query.city);
    let search_query = request.query.city;
    let geoData = require('./data/location.json');
    let returnObj = new Location(search_query, geoData[0]);
    console.log(returnObj);
    // let returnObj = {
    //   search_query: search_query,
    //   formatted_query: geoData[0].display_name,
    //   latitude: geoData[0].lat,
    //   longitude: geoData[0].lon
    // }
    response.status(200).send(returnObj);
  } catch(err){
    console.log('ERROR', err);
    response.status(500).send('sorry, we messed up');
  }
})
function Location(searchQuery, obj){
  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}
app.get('*', (request, response) => {
  response.status(404).send('sorry, this route does not exist');
})
//WEATHER
app.get('/weather', (request, response) => {
  try {
    let geoData = require('./data/weather.json')
    let weatherArray = geoData.data.map(day => {
      return new Weather(day);
    })
    response.status(200).send(weatherArray);
  } catch (err) {
    console.log('ERROR', err);
    response.status(500).send('sorry, we messed up');
  }
})
// turn on the lights - move into the house - start the server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});