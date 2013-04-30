var path = require('path')
  , fs = require('fs')
  , utils = require('../utils');


module.exports = function(spec) {
  if (typeof spec == 'string') {
    var data = fs.readFileSync(spec)
    spec = JSON.parse(data);  
  }
  spec = spec || {};
  
  var pattern = spec.pattern;
  var keys = [];
  var regexp = pattern ? utils.pathRegexp(pattern, keys) : undefined;
  
  return function(pkg, next) {
    if (!pkg.path) { return next(); }
    
    var basename = path.basename(pkg.path);
    if (regexp) {
      var m = regexp.exec(basename);
      if (m) {
        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = 'string' == typeof m[i]
            ? decodeURIComponent(m[i])
            : m[i];

          if (key) {
            pkg[key.name] = val;
          } else {
            // TODO: Implement support for RegExp `pattern`
          }
        }
      }
    }
    if (spec) { utils.merge(pkg, spec); }
    next();
  }
}
