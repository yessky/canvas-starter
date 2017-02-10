(function(Sketch, undefined) {

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

})(this.Sketch, undefined);