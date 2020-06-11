////////////////WEATHER 
  app.get('/weather', (request, response) => {
    let search_query = request.query.search_query;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${search_query}&key=${process.env.WEATHER_API_KEY}`;
    superagent.get(url)
    .then(resultsFromSuperAgent => {
      let weatherResult = resultsFromSuperAgent.body.data.map(day =>{
        return new Weather(day);
      })
      response.status(200).send(weatherResult);
    }).catch(err => console.log(err));
  })
function Weather(obj){
  this.forecast = obj.weather.description;
  this.time = obj.valid_date;
  // array.push(this);
}
////////////////HIKING
app.get('/trails', (request, response) => {
  try{
    let latitude = request.query.latitude;
    let longitude = request.query.longitude;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAIL_API_KEY}`;
    superagent.get(url)
    .then(resultsFromSuperAgent => {
      let hikingResults = resultsFromSuperAgent.body.trails.map(hike => new Hiking(hike));
      response.status(200).send(hikingResults);
   }).catch(err => console.log(err))
  } catch(err) {
    console.log(err);
    response.status(500).send('Sorry! Take a Hike!');
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