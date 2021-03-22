//Variables and dependencies
var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

//Login config
var auth = require('http-auth');
var basic = auth.basic({
        realm: "Protected Area"
    }, function (username, password, callback) {
        callback(username === "admin" && password === process.env.ADMIN_PASSWORD);
    }
);

//Database config
const { Pool, Client } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  statement_timeout: 10000
})
app.get('/db', function (request, response) {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT * from cars ORDER BY id', (err, result) => { //row_number() OVER () as rnum,
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
app.get('/admin', auth.connect(basic), function(req,res){
 res.sendFile(__dirname + '/admin/admin.html');
});

app.use(bodyParser.urlencoded({ extended: true }));

//Database Insert
app.post('/admin/insert', auth.connect(basic), function(req, res) {
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
app.post('/admin/update', auth.connect(basic), function(req, res) {
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
app.post('/admin/delete', auth.connect(basic), function(req, res) {
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
