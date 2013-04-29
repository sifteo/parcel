var path = require('path');


module.exports = function() {
  
  return function basename(pkg, next) {
    if (!pkg.path) { return next(); }
    
    var basename = path.basename(pkg.path);
    pkg.filename = basename;
    next();
  }
}
