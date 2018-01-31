//Variables and dependencies
var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

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
    client.query('SELECT  * from cars', (err, result) => { //row_number() OVER () as rnum,
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log('Table printed as output.')
      response.send(result.rows)
    })
  })
});

//App start
app.get('/', function (req, res) { res.sendFile(__dirname + '/search.html') })
app.set('port', (process.env.PORT || 5000))
app.use('/public', express.static(__dirname + '/public'));


//Admin page
app.get('/admin', function(req,res){
 res.sendFile(__dirname + '/admin/admin.html');
});

app.use(bodyParser.urlencoded({ extended: true }));

//Database Insert
app.post('/admin/insert', function(req, res) {
  res.sendFile(__dirname + '/admin/admin.html');
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('INSERT INTO cars(id, name, plate) VALUES (default, $1::text, $2::text)',[req.body.name,req.body.plate], (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log('Row inserted')
    })
  })
});

//Database Update
app.post('/admin/update', function(req, res) {
  res.sendFile(__dirname + '/admin/admin.html');
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('UPDATE cars SET name = $1::text, plate = $2::text WHERE id = $3::integer',[req.body.name,req.body.plate,req.body.id], (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log('Row updated')
    })
  })
});

//Database Delete
app.post('/admin/delete', function(req, res) {
  res.sendFile(__dirname + '/admin/admin.html');
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('DELETE FROM cars WHERE id = $1::integer', [req.body.id], (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log('Row deleted')
    })
  })
});

//Port listening
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
