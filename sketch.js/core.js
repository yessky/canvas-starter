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
    },
    getCenter: function() {
      var w = this.right - this.left;
      var h = this.bottom - this.top;
      return new Sketch.Position(this.left + w / 2, this.top + h / 2);
    },
    intersect: function(bounds) {

    }
  });

  Sketch.Layer = Sketch.declare('Sketch.Layer', null, {
    constructor: function(container) {
      var w = container.scrollWidth;
      var h = container.scrollHeight;
      this.container = container;
      this.size = Sketch.Size(w, h);
      this.zoom = 100;
      this.bounds = Sketch.Bounds(-w / 2, -h / 2, w / 2, h / 2);
      this.painter = Sketch.Canvas(this);
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
      layer.appendChild(this.canvas);
    },
    resize: function(size) {
      var canvas = this.canvas;
      var style = canvas.style;
      canvas.width = size.w;
      canvas.height = size.h;
      style.width = size.w + 'px';
      style.height = size.h = 'px';
    },
    setStyle: function(name, value) {
      for (var i in value) {
        var val = value[i];
        if (i === 'color') {
          if (name === 'fill') {
            this.context.fillStyle = val;
          } else {
            this.context.strokeStyle = val;
          }
        } else if (i === 'opacity') {
          this.context.globaAlpha = val;
        } else {
          this.context[i] = val;
        }
      }
    },
    getCoord: function(point) {
      var resolution = this.layer.zoom / 100;
      var bounds = this.layer.bounds;
      var x = (point.x - bounds.left) * resolution;
      var y = (bounds.top - point.y) * resolution;
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
      this.context.clearRect(this.layer.size.w, this.layer.size.h);
      var children = this.children;
      for (var i in children) {
        this.draw(children[i]);
      }
    }
  });

  Sketch.Geometry = Sketch.declare('Sketch.Geometry', null, {
    constructor: function() {
      this.id = Sketch.guid('geometry_');
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
    draw: function(painter) {
    	var coord = painter.getCoord(this);
    	var context = painter.context;
    	context.save();
    	context.setStyle(this.style || Sketch.defaultStyle);
    	context.beginPath();
    	context.arc(coord.x, coord.y, 3, 0, Sketch.PI2);
    	context.closePath();
    	context.stroke();
  		context.fill();
  		context.restore();
    }
  });

})(this.Sketch, undefined);
