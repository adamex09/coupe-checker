//Variables and dependencies
var express = require('express');
var request = require('request');
var pg = require('pg');
var app = express();

//Database config
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

//App start
app.get('/', function (req, res) { res.send('Hello World') })
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))


//Port listening
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
