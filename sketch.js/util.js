(function(Sketch, undefined) {

	var ids = {};
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