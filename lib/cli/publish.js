var parcel = require('../')
  , fs = require('fs')
  , Package = require('../package');


exports = module.exports = function publish(rinfo, file, options, cb) {
  options = options || {};
  
  if (!fs.existsSync(file)) { return cb(new Error('File does not exist: ' + file)); }
  
  parcel.boot(options, function(err) {
    if (err) { return cb(err); }
    
    var repo = parcel.createRepository(rinfo);
    var pkg = new Package(file);
    parcel.parse(pkg, function(err) {
      if (err) { return cb(err); }
      
      console.log('Publishing ' + pkg.filename);
      console.log('  name: ' + pkg.name);
      console.log('  version: ' + pkg.version);
      console.log('  os: ' + pkg.os || 'unknown');
      console.log('  arch: ' + pkg.arch || 'any');
      
      
      repo.publish(pkg, function(err) {
        if (err) { return cb(err); }
        return cb();
      });
    });
  });
}
