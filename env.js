// TRAIL_HIKING=200793087-07bb9584bd3c09c6b601b1526ccafc64
// //https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200793087-client.query(sqlQuery, safeValue)
.then(()=> {

})

app.get('/add', (request, response)=>{
  //collect information to add to our database
  console.log('on the add route', request.query);

  let first= request.query.first;
  let last = request.query.last;
  let sqlQuery =  'INSERT INTO peopl (first_name, last_name)';

  client.query(sqlQuery, safeValue)
  .then()
  .catch()
})

app.get('/location'(request, response)=>{
  let sqlResults = 'SELECT * FROM locations;';

  client.query(sqlQuery)
  .then(sqlResults => {
    console.log(sqlResults.rows);
    response.status(200).send(sqlResults.rows);
  })
  .catch()
})
app.get('*', (request, respnose)=> {
  response.status(404).send('route not found');
})

client.connect()
.then(()=>{
  app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`);
  })
})


/////
if (sequalResults, safeValues)
.the(sqlQuery => {
    if(sqlResults.rowCount){
    respnose.staty(200).send(sequalResults.rows[0]);
    }
})