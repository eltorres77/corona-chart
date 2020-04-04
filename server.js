const express = require('express'),
    app = express(),
    https = require('https'),
    fs = require('fs'),
    request = require('request')
    moment = require('moment'),
    morgan = require('morgan');

app.use(express.static('client'));
app.use(express.static('node_modules'));
app.use(express.static('data'));

const fileUri = 'https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-';

app.use(morgan('combined'));

app.get('/today-data', function(req, res){

  const todayFileUri = fileUri +  moment().format("YYYY-MM-DD") + '.xlsx';
  request.get(todayFileUri).pipe(res);

});


app.listen(3000);