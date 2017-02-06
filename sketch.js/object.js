(function(Sketch, undefined) {

	Sketch.Object = Sketch.declare('Sketch.Object', null, {
		constructor: function() {
			this.id = Sketch.uid(this.typedef.replace(/\./g, '_').toLowerCase());
			this.cacheCanvas = document.createElement('canvas');
			this.cacheContext = this.cacheCanvas.getContext('2d');
			this.colorKey = Sketch.uniqueColor();
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