var express = require('express'),
	app = express(),
	http = require('http'),
	fs = require('fs'),
	querystring = require('querystring'),
	request = require('request'),
	port = 8080;

app.listen(port);
app.use(express.bodyParser())

app.use(express.static(__dirname + '/public'));

console.log("Server started.\nAvailable on localhost:" + port);