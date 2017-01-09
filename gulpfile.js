var gulp = require('gulp');
var gutil = require('gutil');
var del = require('del');
var through2 = require('through2');
var sequence = require('run-sequence');

var isEnded = false;

gulp.task('default', function(cb) {
	var counter = 0;
	gulp.src([
		// 'index.tpl',
		'./test-*.html'
	], {read: false})
	.pipe(through2.obj(function(file, enc, done) {
		this.push(file);
		counter++;
		done();
	}))
	.pipe(gulp.dest('./'))
	.on('end', onReady);

	function onReady() {
		gulp.src('index.tpl')
			.pipe(through2.obj(function(file, enc, done) {
				var tpl = file.contents + '';
				var content = '';
				for (var i = 1; i <= counter; ++i) {
					var idx = i < 10 ? '0' + i : i;
					content += '\n\t<p><a href="test-' + idx + '.html" target="_blank">Chapter ' + idx + '</a></p>';
				}
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