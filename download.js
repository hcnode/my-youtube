/**
 * Created by harry on 16/4/19.
 */
var fs = require('fs');
var youtubedl = require('youtube-dl');

module.exports = {
	back : function (item, cb) {
		var video = youtubedl(item.link,
			// Optional arguments passed to youtube-dl.
			['--format=bestvideo[ext=mp4]'],
			// Additional options can be given for calling `child_process.execFile()`.
			{ cwd: __dirname });

		// Will be called when the download starts.
		video.on('info', function(info) {
			console.log('Download started');
			console.log('filename: ' + info.filename);
			console.log('size: ' + info.size);
		});
		video.on('end', function() {
			cb();
		});

		video.pipe(fs.createWriteStream(__dirname + '/video/'+ item.title +'.mp4'));
	},
	direct : function (url, res) {
		var video = youtubedl(url,
			// Optional arguments passed to youtube-dl.
			['--format=bestvideo[ext=mp4]'],
			// Additional options can be given for calling `child_process.execFile()`.
			{ cwd: __dirname });

		// Will be called when the download starts.
		video.on('info', function(info) {
			console.log('Download started');
			console.log('filename: ' + info.filename);
			console.log('size: ' + info.size);
			res.set("Content-Disposition", 'attachment;filename="' + encodeURIComponent(info.filename) + '"');
		});
		video.pipe(res);
	}
}