(function(Sketch, undefined) {

	var ids = {};
	var colors = {};
	var op = Object.prototype;
	var ops = op.toString;

	function isTypeOf(obj, name) {
		return ops.call(obj) === '[object ' + name + ']';
	}

	Sketch.guid = function(prefix) {
		prefix = prefix || 'sketch';
		if (ids[prefix] === undefined) {
			ids[prefix] = 0;
		}
		ids[prefix] += 1;
		return prefix + '_' + ids[prefix];
	};

	Sketch.random = function(min, max) {
		return min + Math.floor((max - min) * Math.random());
	};

	Sketch.uniqueColor = function() {
		while (true) {
			var key = ('000000' + Math.floor(0x1000000 * Math.random()).toString(16)).slice(-6);
			if (!colors[key]) {
				colors[key] = true;
				return '#' + key;
			}
		}
	};

	Sketch.isFunction = function(obj) {
		return isTypeOf(obj, 'Function');
	};

	Sketch.isString = function(obj) {
		return isTypeOf(obj, 'String');
	};

	Sketch.isArray = function(obj) {
		return isTypeOf(obj, 'Array');
	};

	Sketch.isNumber = function(obj) {
		return isTypeOf(obj, 'Number');
	};

	Sketch.PI2 = Math.PI * 2;

})(this.Sketch, undefined);