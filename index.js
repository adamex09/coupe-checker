//Variables and dependencies
var express = require('express');
var request = require('request');
var app = express();

console.log(process.env.DATABASE_URL)

//Database config
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
// await client.connect();


client.connect()

app.get('/db', function (request, response) {

  client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
    console.log(err ? err.stack : res.rows[0].message) // Hello World!
    client.end()
  })

//Database config
  // client.query('SELECT * FROM test_table', function(err, result) {
  //     if (err)
  //      { console.error(err); response.send("Error " + err); }
  //     else
  //      { response.render('pages/db', {results: result.rows} ); }
  //      client.end();
  //   });

});



//App start
app.get('/', function (req, res) { res.send('Hello World2') })
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))


//Port listening
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
