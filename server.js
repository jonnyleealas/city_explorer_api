
'use strict'


//express library sets up our server
const express = require('express');
// tells who is ok to send data to
const cors = require('cors');
//this looks for information for us
const superagent= require('superagent');
//secret library lets us go into the .env file
require('dotenv').config();

//initalizes our exrpess library into our variable called app
const app = express();
app.use(cors());
//bring in the PORT by using process.env.variable name. or 3001 is a debuger.
const PORT = process.env.PORT || 3001;
// Locations
app.get('/location', (request, response) => {
  let city = request.query.city;
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ}&q=${city}&format=json`;
  superagent.get(url)
    .then(resultsFromSuperAgent => {
      let finalObj = new Location(city, resultsFromSuperAgent.body[0]);
      response.status(200).send(finalObj);
    })
})


//weather
function WeatherObj(obj){
  this.forecast = obj.weather.description;
  this.time = obj.valid_date;
}

app.get('/weather', (request, response)=>{
  let search_query = request.query.search_query;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=38.0&lon=-78.0&threshold=63&units=I&key=${process.env.WEATHER_BIT}&q=${search_query}&format=json`;
  superagent.get(url);

  superagent.get(url)
    .then(resultsFromSuperAgent => {
      let weatherResult = resultsFromSuperAgent.body.data.map(day=>{
        return new WeatherObj(day);
      })

      response.status(200).send(weatherResult);
    }).catch(err => console.log(err));
})
app.get('*',(request, response)=> {
  response.status(404).send('No Route Exists');
})

app.get('/location',(request, response)=>{
  try{
    let city = request.query.city;
    let geoData = require('./data/location.json');
    let returnObj= new Location (city, geoData[0]);
    console.log(returnObj);

    response.status(200).send(returnObj);
  } catch(err){
    console.log('error', err);
    response.status(500).send('sorry, we messed up');
  }
})

function Location(searchQuery, obj){
  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}
app.get('*',(request, response)=> {
  response.status(404).send('this route does not exist');
})
//weather
app.get('/weater', (request, response)=> {
  try{
    let geoData = require('./date/weater.json')
    let weatherArray = geoData.data.map(day => {
      return new WeatherObj(day);
    })
    response.status(200).send(weatherArray);
  } catch(err) {
    console.log('error', err);
    response.status(500).send('Sorry Something Went Wrong');
  }
})

app.listen(PORT,() =>{
  console.log(`listening on ${PORT}`)
});
