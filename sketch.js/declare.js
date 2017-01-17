(function(Sketch, undefined) {

	var xtor = new Function;
	var op = Object.prototype;
	var ops = op.toString;
	var empty = {};
	var xname = 'constructor';
	var cname = 'clsname';
	var cmeta = 'clsmeta';

	function err(msg, cls) {
		throw new Error('Sketch.declare("' + cls + '"): ' + msg);
	}

	// C3 Method Resolution Order (see http://www.python.org/download/releases/2.3/mro/)
	function c3mro(bases, cls) {
		var seqs = [];
		var clsnum = 0;
		var clsmap = {};
		var tail = {
			pos: 0,
			map: {},
			refs: []
		};

		// console.log(cls + ' mro =================')

		// build a proper data structure
		for (var i = 0, l = bases.length; i < l; ++i) {
			var base = bases[i];
			var meta = base[cmeta];
			var refs = meta ? meta.bases.slice(0) : [];
			var clsname = base.prototype[cname];
			var seq = {
				pos: 0,
				map: {},
				refs: refs
			};

			tail.refs.push(base);
			tail.map[clsname] = true;

			for (var j = 0, s = refs.length; j < s; ++j) {
				clsname = refs[j].prototype[cname];
				seq.map[clsname] = true;
				if (!clsmap[clsname]) {
					clsnum++;
					clsmap[clsname] = true;
				}
			}
			seqs.push(seq);
		}
		if (l > 1) {
			seqs.push(tail);
		}

		// console.log(seqs.slice(0), clsnum, seqs.length);

		// merge resolution order
		var linear = [];
		for (var i = 0;;) {
			if (!clsnum || i === seqs.length) {
				// end of seqs, or can not build linear mro
				break;
			}

			// console.log(['current seq ', i, ' of ', seqs.length].join(''))

			var seq = seqs[i];
			var head = seq.refs[0]; // take head
			var clsname = head.prototype[cname];

			// console.log('check head ' + clsname +' at ' + i);

			// test if it is a good head
			for (var j = 0; j < seqs.length; ++j) {
				if (i !== j) {
					var q = seqs[j];
					if ((clsname in q.map) && q.refs[0].prototype[cname] !== clsname) {
						// console.log(clsname + ' is a bad head');
						head = false;
						break;
					}
				}
			}

			// find a good head
			if (head) {
				// once we find a good head,  go back to the head of seqs
				i = 0;
				clsnum--;
				linear.push(head);

				// console.log(clsname + ' is a good head');

				// delete ref from all seqs
				for (var j = 0; j < seqs.length; ++j) {
					var q = seqs[j];
					// delete it from current seq map
					delete q.map[clsname];
					// delete it from current seq
					if (q.refs.length > 0 && q.refs[0].prototype[cname] === clsname) {
						q.refs.shift();
					}
					// delete empty seq from seqs
					if (q.refs.length === 0) {
						// console.log(['splice ' + j]);
						if (j < i) {
							i--;
						}
						seqs.splice(j--, 1);
						continue;
					}

					// console.log(['seq refs ', j, q.refs.length])
				}
			}
			// not a good head, move to next seq
			else {
				i++;
			}
		}

		if (clsnum) {
			throw new Error('can not build a consistent and linear method resolution order');
		}

		// console.log(linear);

		return linear;
	}

	function inherited() {
		var a = arguments;
		var caller, meta, bases, pos, name, base, proto, f, opf, cache;

		if (a.length > 1) {
			name = a[0];
			args = a[1];
		} else {
			args = a[0];
		}

		caller = args.callee;
		name = name || caller.nom;

		if (!name) {
			// toto: throw error
		}

		meta = this.constructor[cmeta];
		bases = meta.bases;
		cache = this.__super__ = this.__super__ || {};
		pos = cache.p;

		if (name !== xname) {
			if (cache.c !== caller) {
				pos = 0;
				base = bases[0];
				meta = base[cmeta];
				if (meta.proto[name] !== caller) {
					while (base = bases[++pos]) {
						meta = base[cmeta];
						proto = base.prototype;
						if (meta && meta.proto[name] === caller || proto[name] === caller && proto.hasOwnProperty(name)) {
							break;
						}
					}
					pos = base ? pos : -1;
				}
			}
			// find a proper method
			opf = op[name];
			while (base = bases[++pos]) {
				proto = base.prototype;
				if (proto[name] && (base[cmeta] ? proto.hasOwnProperty(name) : opf !== proto[name])) {
					f = proto[name];
					break;
				}
			}
			f = base && f || opf;
		} else {
			// not support call inherited constructor
		}

		cache.p = pos;
		cache.c = f;

		if (f) {
			return f.apply(this, args);
		}
	}

	function isInstanceOf(superclass) {
		var bases = this.constructor[cmeta].bases;
		for (var i = 0, l = bases.length; i < l; ++i) {
			if (bases[i] === superclass) {
				return true;
			}
		}
		return this instanceof superclass;
	}

	function extend(descriptor) {
		safeMixin(this.prototype, descriptor);
		return this;
	}

	function mix(dest, source, mixFunc) {
		for (var name in source) {
			var s = source[name];
			if (!(name in dest) || (dest[name] !== s &&
					(!(name in empty) || empty[name] !== s))) {
				dest[name] = mixFunc ? mixFunc(name, s) : s;
			}
		}
		return dest;
	}

	function mixOwn(target, source) {
		for (var name in source) {
			if (name !== xname && source.hasOwnProperty(name)) {
				target[name] = source[name];
			}
		}
	}

	function safeMixin(target, source) {
		var name, t;
		for (name in source) {
			t = source[name];
			if ((t !== op[name] || !(name in op)) && name !== xname) {
				if (toString.call(t) === '[object Function]') {
					t.nom = name;
				}
				target[name] = t;
			}
		}

		return target;
	}

	// chained constructor
	function chainedCtor(bases) {
		return function() {
			if (!(this instanceof arguments.callee)) {
				// not called via new, so force it
				return applyNew(arguments);
			}
			// call super constructors
			for (var i = bases.length - 1; i >= 0; --i) {
				var f = bases[i];
				var m = f[cmeta];
				var f = m ? m.ctor : f;
				if (f) {
					f.apply(this, arguments);
				}
			}
		};
	}

	// simple constructor
	function simpleCtor(ctor) {
		return function() {
			if (!(this instanceof arguments.callee)) {
				return applyNew(arguments);
			}
			// call super constructors
			if (ctor) {
				ctor.apply(this, arguments);
			}
		};
	}

	// get a new object that inherits from ctor.prototype
	function forceNew(ctor) {
		xtor.prototype = ctor.prototype;
		var obj = new xtor;
		xtor.prototype = null;
		return obj;
	}

	// works as 'new ctor()'
	function applyNew(args) {
		var ctor = args.callee;
		var obj = forceNew(ctor);
		ctor.apply(obj, args);
		return obj;
	}

	function declare(clsname, superclass, descriptor) {
		var bases = [0];
		var parents = superclass;
		var base, meta, proto, ctor, i;

		// compute method resolution order
		if (toString.call(superclass) === '[object Array]') {
			bases = bases.concat(c3mro(superclass, clsname));
		} else {
			if (superclass) {
				if (toString.call(superclass) === '[object Function]') {
					meta = superclass[cmeta];
					bases = bases.concat(meta ? meta.bases : superclass);
				} else {
					err("super class is not a callable constructor.", clsname);
				}
			} else if (superclass !== null) {
				err("unknown super class.", clsname);
			}
		}


		// build constructor prototype
		superclass = bases[bases.length - 1];
		if (superclass) {
			for (i = bases.length - 2;; --i) {
				proto = forceNew(superclass);
				if (!i) {
					break;
				}
				base = bases[i];
				(base[cmeta] ? mixOwn : mix)(proto, base.prototype);
				ctor = new Function;
				ctor.superclass = superclass;
				ctor.prototype = proto;
				superclass = proto.constructor = ctor;
			}
		} else {
			proto = {};
		}
		safeMixin(proto, descriptor);

		// add constructor
		ctor = descriptor.constructor;
		if (ctor !== op.constructor) {
			ctor.nom = xname;
			proto.constructor = ctor;
		}

		// declare the class
		bases[0] = ctor = bases.length === 1 ? simpleCtor(descriptor.constructor) : chainedCtor(bases);
		ctor[cmeta] = {
			bases: bases,
			parents: parents,
			ctor: descriptor.constructor,
			proto: descriptor
		};
		ctor.extend = extend;
		ctor.prototype = proto;
		proto.constructor = ctor;
		proto.inherited = inherited;
		proto.isInstanceOf = isInstanceOf;
		if (clsname) {
			proto[cname] = clsname;
		}

		return ctor;
	}

	Sketch.declare = declare;

})(this.Sketch, undefined);