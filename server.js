'use stricrt'
//express library sets up our server
const express = require('express');
//initalizes our exrpess library into our variable called app
const app = express();
//secret library lets us go into the .env file
require('dotenv').config();

// tells who is ok to send data to
const cors = require('cors');
app.use(cors());

app.use(express.static('./public'));
//bring in the PORT by using process.env.variable name. or 3001 is a debuger.
const PORT = process.env.PORT || 3001;


app.get('/location',(request, response)=>{
  console.log(request.query.city);
  let search_query = request.query.city;
  let geoData = require('./data/location.json');
  let returnObj = new Location(search_query, geoData[0]);

  response.status(200).send(returnObj);
})

function Location(searchQuery, obj){
  this.search_query= searchQuery;
  this.formatted_query= obj.display_name;
  this.latitude= obj.lat;
  this.longitude= obj.lon;
}


app.get('/weather', (request, response)=>{
  try{

    let weatherArray=[];
    let weatherData= require('./data/weather.json');
    weatherData.data.forEach(element =>{
      new WeatherObj(element, weatherArray);
    })
    response.status(200).send(weatherArray);
  } catch (err) {
    console.log('ERROR', err);
    response.status(500).send('sorry, we messed up');
  }

})

function WeatherObj(obj, arr){
  this.forecast = obj.weather.description;
  this.time = obj.valid_date;
  arr.push(this);
}

// if it works its
app.get('*',(request, response)=>{

  response.status(404).send('this route does not exist');
})

//turn on the lights
app.listen(PORT,()=>{
  console.log(`listening on ${PORT}`)
})
