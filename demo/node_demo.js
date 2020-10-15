var dt = require('./node_module_demo');
var http = require('http');
var url = require('url');
var fs = require('fs');
var uc = require('upper-case');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var formidable = require('formidable');
var nodemailer = require('nodemailer');

http.createServer(function (req, res) {
	//res.writeHead(200, {'content-type':'text/html'});
	var q = url.parse(req.url, true);
	console.log(q.host);
	console.log(q.pathname);
	console.log(q.search);
	console.log(q.query); //parameters
	var eventHandler = function() {
		console.log("I hear a scream!");
	}
	eventEmitter.on('scream', eventHandler);
	eventEmitter.emit('scream');
	if (req.url == '/fileupload') {
			var form = new formidable.IncomingForm();
			form.parse(req, function (err, fields, files) {
				var oldpath = files.filetoupload.path;
				var newpath = 'C:/Users/Admin/node_projects/demo/output/' + files.filetoupload.name;
				fs.rename(oldpath, newpath, function (err) {
					if (err) throw err;
					res.write('File uploaded and moved!');
					res.end();
				});
			});
			var transporter = nodemailer.createTransport({
				service: 'fakemail',
				auth: {
					user: 'ezekial.daris@intrees.org',
					pass: 'yfynh7W?'
				}
			});
			var mailOptions = {
				from: 'ezekial.daris@intrees.org',
				to: 'ravichandran.prabhakaran@gmail.com',
				subject: 'Node.js email check',
				html: '<h1>Welcome</h1><p>That was easy!</p>'
			}
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					console.log(error);
				} else {
					console.log('Email sent: '+info.response);
				}
			});
	} else {
		fs.readFile('.'+q.pathname, function(err, data) {
			if(err) {
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found");
			}
			res.writeHead(200, {'content-type':'text/html'});
			res.write(data);
			res.write(uc.upperCase("The date & time are currently: ") + dt.myDateTime());
			return res.end();
		});
	}
	//var fileName = ['mynewfile2.txt','mynewfile3.txt'];
	/*
	fileName.forEach(path => { 
		fs.unlinkSync(path);
		return;
 	});
	fs.open('mynewfile2.txt', 'w', function (err, file) {
		if (err) throw err;
		console.log('Saved!');
	});
	fs.writeFile('mynewfile3.txt', fileData, function (err) {
		if (err) throw err;
		console.log('Saved!');
	});
	fs.unlink('mynewfile2', function (err) {
		if (err) throw err;
		console.log('File deleted!');
	});
	*/
}).listen(8080);