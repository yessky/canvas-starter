(function(Sketch, undefined) {

	// version
	Sketch.version = '1.0.0-beta';

	// author
	Sketch.author = 'arron.xiao';

	Sketch.inherits = (function() {
		var xtor = new Function;

		function forceNew(ctor) {
			xtor.prototype = ctor.prototype;
			var obj = new xtor;
			xtor.prototype = null;
			return obj;
		}

		function chainedCtor(base, ctor) {
			return function() {
				if (base) {
					base.apply(this, arguments);
				}
				if (ctor) {
					ctor.apply(this, arguments);
				}
			};
		}

		return function(base, props) {
			var ctor = chainedCtor(base, props.constructor);
			var proto = forceNew(base);
			for (var i in props) {
				proto[i] = props[i];
			}

			// apply "inherits"
			clazz.meta = {
				ctor: ctor,
				base: base
			};
			clazz.prototype = proto;
			proto.constructor = clazz;

			return clazz;
		};
	})();

})(window.Sketch = {}, undefined);