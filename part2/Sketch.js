(function(Sketch, undefined) {

	// version
	Sketch.version = '1.0.0-beta';

	// author
	Sketch.author = 'arron.xiao';

	// declare class
	Sketch.declare = (function() {
		var xtor = new Function;
		var op = Object.prototype;
		var cname = 'constructor';

		function err(msg, cls) {
			throw new Error('Sketch.declare' + (cls ? ' ' + cls : '') + ': ' + msg);
		}

		function applyNew(args) {
			var ctor = args.callee;
			var obj = forceNew(ctor);
			ctor.apply(obj, args);
			return obj;
		}

		function forceNew(ctor) {
			xtor.prototype = ctor.prototype;
			var obj = new xtor;
			xtor.prototype = null;
			return obj;
		}

		function chainedCtor(base, ctor) {
			return function() {
				if (!(this instanceof arguments.callee)) {
					return applyNew(arguments);
				}

				if (base) {
					var f = base.creator || base;
					f.apply(this, arguments);
				}
				if (ctor && ctor !== op.constructor) {
					ctor.apply(this, arguments);
				}
			};
		}

		function safeMixin(target, source) {
			var name, t;
			for (name in source) {
				t = source[name];
				if ((t !== op[name] || !(name in op)) && name !== cname) {
					if (op.toString.call(t) === '[object Function]') {
						t.named = name;
					}
					target[name] = t;
				}
			}
			return target;
		}

		return function(className, base, props) {
			if (typeof className !== 'string') {
				props = base;
				base = className;
				className = '';
			}
			props = props || {};

			if (!base && base !== null) {
				err('unknown superclass', className);
			}

			var creator = props.constructor;
			var proto = base ? forceNew(base) : {};
			safeMixin(proto, props);
			if (creator !== op.constructor) {
				creator.named = cname;
				proto.constructor = creator;
			}

			var ctor = chainedCtor(base, creator);
			ctor.creator = creator;
			ctor.superclass = base && base.prototype;
			ctor.prototype = proto;
			proto.constructor = ctor;
			if (className) {
				proto.typed = className;
			}

			return ctor;
		};
	})();

	Sketch.guid = (function() {
		var ids = {};

		return function(prefix) {
			prefix = prefix || 'sketch';
			if (ids[prefix] === undefined) {
				ids[prefix] = 0;
			}
			ids[prefix] += 1;
			return prefix + '_' + ids[prefix];
		};
	})();

	// Poistion: 位置
	Sketch.Position = Sketch.declare('Sketch.Poistion', null, {
		constructor: function(x, y) {
			this.x = x;
			this.y = y;
		}
	});

	// Size: 尺寸
	Sketch.Size = Sketch.declare('Sketch.Size', null, {
		constructor: function(w, h) {
			this.w = w;
			this.h = h;
		}
	});

	// Bounds: 矩形范围
	Sketch.Bounds = Sketch.declare('Sketch.Bounds', null, {
		constructor: function(x1, y1, x2, y2) {
			this.left = x1;
			this.top = y1;
			this.right = x2;
			this.bottom = y2;
		},
		getCenter: function() {
			var w = this.right - this.left;
			var h = this.bottom - this.top;
			return new Sketch.Position(this.left + w / 2, this.top + h / 2);
		},
		intersect: function(bounds) {

		}
	});

})(window.Sketch = {}, undefined);