(function(Sketch, undefined) {

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

}(this.Sketch, undefined));