(function() {
  function loadImages(images, cb) {
    function load(src, cb) {
      var img = new Image;
      img.src = src;
      if (img.complete) {
        return cb(img);
      }
      img.onload = function() {
        cb(img);
      };
    }
    var result = {};
    var names = Object.keys(images);
    var total = names.length;
    var loaded = 0;
    names.forEach(function(name) {
      load(images[name], function(data) {
        result[name] = data;
        loaded += 1;
        if (loaded === total) {
          cb(result);
        }
      });
    });
  }

  window.loader = {
    load: loadImages
  };
})();
