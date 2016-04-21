/**
 * Created by harry on 16/4/19.
 */
var jsdom = require("jsdom");
var express = require('express');
var download = require('./download');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
app.set('port',process.env.PORT || 8005);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'))
app.get('/getplaylist', function (req, res, next) {
	var result = [];
	var dbpath = __dirname + '/db/';
	var videopath = __dirname + '/video/';
	fs.readdir(dbpath, function (err, files) {
		files.filter(file => file != '.' && file != '..').forEach(file => {
			var list = JSON.parse(fs.readFileSync(dbpath + file).toString());
			list.forEach(item => {
				if(fs.existsSync(videopath + item.title)){
					item.isDownload = true;
				}
			});
			result.push({
				title : file,
				list : list
			});
		});
		res.json(result);
	});
});
//listen port
app.listen(app.get('port'),function(){
	console.log("start server...")
});

module.exports = app;