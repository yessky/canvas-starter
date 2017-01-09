var gulp = require('gulp');
var gutil = require('gutil');
var del = require('del');
var through2 = require('through2');
var sequence = require('run-sequence');

var isEnded = false;

gulp.task('default', function(cb) {
	var counter = 0;
	var titleMap = {};
	gulp.src([
		'./test-*.html'
	])
	.pipe(through2.obj(function(file, enc, done) {
		var name = file.path.match(/test-(\d+)\.html$/);
		var title = (file.contents + '').match(/<title>([^<]+)<\/title>/);
		titleMap[name[1]] = title[1];
		counter++;
		this.push(file);
		done();
	}))
	.pipe(gulp.dest('./'))
	.on('end', onReady);

	function onReady() {
		gulp.src('index.tpl')
			.pipe(through2.obj(function(file, enc, done) {
				var tpl = file.contents + '';
				var content = '';
				var keys = Object.keys(titleMap);
				keys.sort(function(a, b) {
					return Number(a) > Number(b) ? 1 : -1;
				});
				keys.forEach(function(idx) {
					content += '\n\t<p><a href="test-' + idx + '.html" target="_blank">Chapter ' + idx + ': ' + titleMap[idx] + '</a></p>';
				});
				content += '\n';
				file.path = file.path.replace('.tpl', '.html');
				file.contents = new Buffer(tpl.replace('$$CONTENT$$', content));
				this.push(file);
				done();
			}))
			.pipe(gulp.dest('./'))
			.on('end', cb);
	}
});