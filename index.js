//Variables and dependencies
var express = require('express');
var request = require('request');
var app = express();

console.log(process.env.DATABASE_URL)

//Database config
const { Pool, Client } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.get('/db', function (request, response) {


  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT * from cars', (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log('Table rows output')
      response.send(result.rows)
    })
  })

});



//App start
app.get('/', function (req, res) { res.send('Hello World2') })
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))


//Port listening
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
