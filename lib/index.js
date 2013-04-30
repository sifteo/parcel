var url = require('url')
  , fs = require('fs')
  , repositories = require('./repositories');


function Parcel() {
  this._parsers = [];
}

Parcel.prototype.boot = function(options, done) {
  if (typeof options == 'function') {
    done = options;
    options = {};
  }
  options = options || {};
  
  this.parse(require('./parsers/basename')());
  this.parse(require('./parsers/spec')(options.packageSpec));
  this.parse(require('./parsers/md5')());
  
  done();
}

Parcel.prototype.createRepository = function(rinfo) {
  var data = fs.readFileSync(rinfo)
    , json = JSON.parse(data);
  
  var uri = url.parse(json.url);
  
  if ('s3:' == uri.protocol) {
    return new repositories.s3.Repository(json.url, json);
  }
  return null;
}

Parcel.prototype.parse = function(fn, done) {
  if (typeof fn === 'function') {
    return this._parsers.push(fn);
  }
  
  // private implementation that traverses the chain of parsers
  var pkg = fn;
  
  var stack = this._parsers;
  (function pass(i, err) {
    if (err) { return done(err); }
    
    var layer = stack[i];
    if (!layer) { return done(); }
    
    try {
      layer(pkg, function(e) { pass(i + 1, e); } )
    } catch (ex) {
      return pass(i + 1, ex);
    }
  })(0);
}


/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Parcel();

/**
 * Expose CLI.
 *
 * @api private
 */
exports.cli = require('./cli');
