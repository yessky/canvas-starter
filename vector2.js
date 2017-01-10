function Vector2(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
Vector2.prototype = {
  constructor: Vector2,
  set: function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  },
  distance: function(v) {
    var dx = v.x - this.x;
    var dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  dot: function(v) {
    return this.x * v.x + this.y * v.y;
  },
  modulus: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  add: function(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  },
  sub: function(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  },
  multiply: function(m) {
    return new Vector2(this.x * m, this.y * m);
  },
  normalize: function() {
    var l = this.modulus();
    return new Vector2(this.x / l, this.y / l);
  },
  rotate: function(theta) {
    var x = this.x * Math.cos(theta) + this.y * Math.sin(theta);
    var y = this.y * Math.cos(theta) - this.x * Math.sin(theta);
    return new Vector2(x, y);
  }
};
Vector2.sub = function(a, b) {
  if (a instanceof Vector2 && b instanceof Vector2) {
    return a.sub(b);
  }
  return new Vector2(a.x - b.x, a.y - b.y);
};
