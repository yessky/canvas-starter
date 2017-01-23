(function(Sketch, undefined) {

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
			this.width = Math.abs(x2 - x1);
			this.height = Math.abs(y2 - y1);
			this.center = Sketch.Position(x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2);
		},
		getCenter: function() {
			var w = this.right - this.left;
			var h = this.bottom - this.top;
			return new Sketch.Position(this.left + w / 2, this.top + h / 2);
		},
		intersect: function(bounds) {
			
		}
	});

	Sketch.Shader = Sketch.declare('Sketch.Shader', null, {
		constructor: function(param) {
			for (var i in param) {
				this[i] = param[i];
			}
		}
	});

	Sketch.Shader.SHADER = Sketch.Shader({
		fill: {
			opacity: .5,
			color: '#f00'
		},
		stroke: {
			opacity: .6,
			color: '#000',
			lineWidth: 1,
			lineCap: 'round',
			lineJoin: 'round'
		}
	});

	Sketch.Layer = Sketch.declare('Sketch.Layer', null, {
		constructor: function(container) {
			var w = container.scrollWidth;
			var h = container.scrollHeight;
			this.container = container;
			this.size = Sketch.Size(w, h);
			this.zoom = 100;
			this.getPixelRatio();
			this.bounds = Sketch.Bounds(-w / 2, -h / 2, w / 2, h / 2);
			this.maxBounds = Sketch.Bounds(-w / 2, -h / 2, w / 2, h / 2);
			this.center = this.bounds.getCenter();
			this.painter = Sketch.Canvas(this);
		},
		getPixelRatio: function() {
			this.pr = 100 / this.zoom;
			this.pixel = this.zoom / 100;
			return this.pr;
		},
		translate: function(x, y) {
			// 坐标系向左运动，则元素相对于坐标向右运动
			if (Sketch.isNumber(x)) {
				this.center.x -= x;
			}
			if (Sketch.isNumber(y)) {
				this.center.y -= y;
			}
		},
		scale: function(zoom) {
			this.zoom = zoom;
		},
		redraw: function() {
			var center = this.center;
			var pr = this.getPixelRatio();
			var w = this.size.w * pr / 2;
			var h = this.size.h * pr / 2;
			var bounds = Sketch.Bounds(center.x - w, center.y - h, center.x + w, center.y + h);
			this.bounds = bounds;
			this.painter.redraw();
		}
	});

	Sketch.Canvas = Sketch.declare('Sketch.Canvas', null, {
		constructor: function(layer) {
			this.canvas = document.createElement('canvas');
			this.context = this.canvas.getContext('2d');
			this.layer = layer;
			this.children = {};
			this.childrenCount = 0;
			this.resize(layer.size);
			layer.container.appendChild(this.canvas);
		},
		resize: function(size) {
			var canvas = this.canvas;
			var style = canvas.style;
			canvas.width = size.w;
			canvas.height = size.h;
			style.width = size.w + 'px';
			style.height = size.h + 'px';
		},
		getCoord: function(point) {
			this.layer.getPixelRatio();
			var bounds = this.layer.bounds;
			var x = (point.x - bounds.left) * this.layer.pixel;
			var y = (point.y - bounds.top) * this.layer.pixel;
			return Sketch.Position(x, y);
		},
		addChild: function(children) {
			if (!Sketch.isArray(children)) {
				children = [children];
			}
			for (var i = 0, l = children.length, child; i < l; ++i) {
				child = children[i];
				this.children[child.id] = child;
				this.draw(child);
			}
			this.childrenCount += l;
		},
		draw: function(child) {
			child.draw(this);
		},
		redraw: function() {
			var size = this.layer.size;
			var bounds = this.layer.bounds;
			var children = this.children;
			this.context.clearRect(0, 0, size.w, size.h);
			for (var i in children) {
				var child = children[i];
				this.draw(child);
				// if (child.getLocalBounds(this).intersect(bounds)) {
				// 	this.draw(child);
				// }
			}
		}
	});

	Sketch.Geometry = Sketch.declare('Sketch.Geometry', null, {
		constructor: function() {
			this.id = Sketch.guid('geometry');
		},
		shader: Sketch.Shader.SHADER,
		draw: function(painter) {
			var context = painter.context;
			this._createPath(context, painter);
			this._applyShader(context, painter);
		},
		_createPath: function(context, painter) {},
		_applyShader: function(context, painter) {
			var shader = this.shader;
			context.save();
			if (shader.fill) {
				for (var i in shader.fill) {
					var value = shader.fill[i];
					if (i === 'opacity') {
						context.globalAlpha = value;
					} else if (i === 'color') {
						context.fillStyle = value;
					}
				}
				context.fill();
			}
			if (shader.stroke) {
				for (var i in shader.stroke) {
					var value = shader.stroke[i];
					if (i === 'opacity') {
						context.globalAlpha = value;
					} else if (i === 'color') {
						context.strokeStyle = value;
					} else {
						context[i] = value;
					}
				}
				context.stroke();
			}
			context.restore();
		}
	});

	Sketch.Point = Sketch.declare('Sketch.Point', Sketch.Geometry, {
		constructor: function(x, y) {
			this.x = x;
			this.y = y;
		},
		getBounds: function() {
			if (!this.bounds) {
				var x = this.x;
				var y = this.y;
				this.bounds = Sketch.Bounds(x, y, x, y);
			}
			return this.bounds;
		},
		getLocalBounds: function(local) {
			var c = local.getCoord(this);
			return Sketch.Bounds(c.x, c.y, c.x, c.y);
		},
		_createPath: function(context, painter) {
			var coord = painter.getCoord(this);
			context.beginPath();
			context.arc(coord.x, coord.y, Sketch.Point.RADIUS, 0, Sketch.PI2);
			context.closePath();
		}
	});

	Sketch.Point.RADIUS = 5;

})(this.Sketch, undefined);