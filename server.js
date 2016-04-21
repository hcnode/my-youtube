/**
 * Created by harry on 16/4/19.
 */
var jsdom = require("jsdom");
var express = require('express');
var download = require('./download');
var fs = require('fs');
// var serveIndex = require('serve-index');
var bodyParser = require('body-parser');
var session = require('express-session')




var app = express();
app.set('port',process.env.PORT || 8001);
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
app.use(require('./basicAuth')());
app.use(function (req, res, next) {
	if (req.authenticated || req.session.isAuth) {
		req.session.isAuth = true;
		next();
	} else {
		res.set("WWW-Authenticate", "Basic realm=\"client Login\"");
		res.statusCode =401;
		res.end();
	}
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'))
app.use('/video', express.static(__dirname + '/video'))
// app.use('/source', serveIndex(__dirname, {'icons': true, view: "details"}))
// app.use('/source', express.static(__dirname))

app.get("/trending", function (req, res, next) {
	jsdom.env(
		"https://www.youtube.com/feed/trending",
		["http://code.jquery.com/jquery.js"],
		{
			headers : {
				cookie: "PREF=cvdm=list&hl=en&gl=US&f4=4000000&f5=30&f1=50000000&al=zh-CN"
			}
		},
		function (err, window) {
			if(err || !window) console.log(err)
			else {
				var $ = window.$;
				var links = $(".expanded-shelf-content-item-wrapper .yt-uix-sessionlink.yt-uix-tile-link");
				var imgs = $(".expanded-shelf-content-item-wrapper .yt-thumb-simple img");

				var result = [];
				for (var i = 0; i < links.length; i++) {
					var description = $(links[i].parentNode.parentNode.parentNode.parentNode.parentNode).find('.yt-lockup-description')
					result.push({
						link: links[i].href,
						title: links[i].innerHTML,
						img: imgs[i].getAttribute('data-thumb') ? imgs[i].getAttribute('data-thumb') : imgs[i].src,
						description : description.length > 0 ? description[0].innerHTML : "",
						isDownload : !!fs.existsSync(__dirname + "/video/"+ links[i].innerHTML +".mp4")
					});
				}
				res.json(result);
			}
		}
	);
});
function getPlaylist(req, cb) {
	var url = req.body.url;
	jsdom.env(
		url,
		["http://code.jquery.com/jquery.js"],
		function (err, window) {
			if(err || !window) console.log(err)
			else {
				var $ = window.$;
				var list = $(".yt-uix-scroller-scroll-unit");
				var result = [];
				for (var i = 0; i < list.length; i++) {
					var item = list[i];
					var link = $(item).find('a.yt-uix-sessionlink');
					var img = link.find('img');
					var text = link.find('h4');
					var title = text.html().trim();
					result.push({
						link: link[0].href,
						title: title,
						img: img[0].getAttribute('data-thumb') ? img[0].getAttribute('data-thumb') : img[0].src,
						description : "",
						isDownload : !!fs.existsSync(__dirname + "/video/"+ title +".mp4")
					});
				}
				cb({
					title : $(".playlist-header h3 a").html(),
					list :result
				});
			}
		}
	);
}
app.post("/playlist", function (req, res, next) {
	getPlaylist(req, function (result) {
		res.json(result);
	});
});

app.post("/savePlaylist", function (req, res, next) {
	getPlaylist(req, function (result) {
		var title = result.title;
		var data = result.list;
		fs.writeFile(__dirname + '/db/' + title, JSON.stringify(data, null, '\t'), (err) => {
			if(err){
				res.json({code:400});
			}else{
				res.json({code:200});
			}
		});
	});
});
app.post("/download_by_back", function (req, res, next) {
	download.back({
		link : req.body.link,
		title : req.body.title
	}, function () {
		var head = req.body.head;
		if(head){
			if(fs.existsSync(__dirname + "/db/" + head)){
				fs.readFile(__dirname + "/db/" + head, function (err, data) {
					var json = JSON.parse(data.toString())
					json.forEach(item => {
						if(item.title == req.body.title){
							item.isDownload = true;
						}
					});
					fs.writeFile(__dirname + "/db/" + head, JSON.stringify(json, null, '\t'), function (err, data) {
						res.json({code:0});
					})
				})
			}
		}else{
			res.json({code:0});
		}
	});
});
app.get("/download", function (req, res, next) {
	download.direct(req.query.url, res);
});
//listen port
app.listen(app.get('port'),function(){
	console.log("start server...")
});

module.exports = app;