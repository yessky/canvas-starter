(function(Sketch, undefined) {

	var ids = {};

	Sketch.guid = function(prefix) {
		prefix = prefix || 'sketch';
		if (ids[prefix] === undefined) {
			ids[prefix] = 0;
		}
		ids[prefix] += 1;
		return prefix + '_' + ids[prefix];
	};

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

})(this.Sketch, undefined);