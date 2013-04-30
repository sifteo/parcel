var fs = require('fs')
  , crypto = require('crypto');


module.exports = function() {
  
  return function(pkg, next) {
    if (!pkg.path) { return next(); }
    
    var md5sum = crypto.createHash('md5');
    var s = fs.ReadStream(pkg.path);
    s.on('data', function(data) {
      md5sum.update(data);
    });
    s.on('end', function() {
      var d = md5sum.digest('base64');
      pkg.md5 = d;
      next();
    });
  }
}
