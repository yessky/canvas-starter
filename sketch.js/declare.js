(function(Sketch, undefined) {

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

	Sketch.declare = function(className, base, props) {
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

})(this.Sketch, undefined);