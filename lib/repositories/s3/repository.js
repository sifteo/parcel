var path = require('path')
  , url = require('url')
  , fs = require('fs')
  , aws = require('aws-sdk')
  , s3Extra = require('./s3-extra')
  , utils = require('../../utils')
  , Package = require('./package');


function Repository(uri, options) {
  options = options || {};
  
  var uri = url.parse(uri);
  console.log(uri);
  
  this._bucket = uri.hostname;
  this._prefix = uri.pathname.slice(1); // slice off leading slash
  this._delimiter = options.delimiter || '/';
  
  this._pattern = options.pattern;
  this._regexp = utils.pathRegexp(this._pattern
    , this._keys = []
    , options.sensitive
    , options.strict);
  
  this._s3 = new aws.S3(options);
  this._s3.listAllObjects = s3Extra.listAllObjects;
}

Repository.prototype.query = function(q, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  
  var self = this;
  this.sync(function(err) {
    if (err) { return cb(err); }
    
    var packages = self.packages
      , results = [];
    for (var i = 0, len = packages.length; i < len; ++i) {
      var pkg = packages[i];
      if (q.match(pkg)) {
        results.push(pkg);
      }
    }
    return cb(null, results);
  });
}

Repository.prototype.publish = function(pkg, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  
  try {
    var p = utils.patternSubstitute(this._pattern, this._keys, pkg);
  } catch(e) {
    return cb(e);
  }
  var dest = path.join(this._prefix, p);
  
  // TODO: Check if dest exists
  
  var self = this;
  fs.readFile(pkg.path, function(err, data) {
    if (err) { return cb(err); }

    var params = {
      Bucket: self._bucket,
      Key: dest,
      Body: data
    }

    self._s3.putObject(params, function(err, data) {
      if (err) { return cb(err); }
      return cb();
    });
  });
}


Repository.prototype.sync = function(options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  
  if (this.packages) { return cb(); }
  
  var self = this;
  
  this.packages = [];
  
  //traverse(this._s3, this._bucket, this._prefix, undefined,
  traverse(this._s3, this._bucket, 'sync/',
    function(content) {
      //console.log('ITEM: ' + content.Key);
      
      var keys = self._keys
        , m = self._regexp.exec(content.Key);
    
      if (!m) return;
      
      //console.log('!!MATCHED');
      //console.log(m);
      
      var pkg = new Package(content);
      
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
      
      self.packages.push(pkg);
    },
    function(err) {
      console.log('DONE');
      
      return cb(err);
    });
  
  
  
}



/**
 * Recursively traverse an S3 bucket tree.
 *
 * `contentFn` will be invoked for each object in the tree.  `doneFn` will be
 * invoked traversal completes (or fails).
 *
 * @param {AWS.S3} s3
 * @param {String} bucket
 * @param {String} prefix
 * @param {Function} contentFn
 * @param {Function} doneFn
 * @api public
 */
function traverse(s3, bucket, prefix, contentFn, doneFn) {
  
  (function list(prefix, cb) {
    var params = {
      Bucket: bucket,
      Delimiter: '/',
      MaxKeys: 1000
    }
    if (prefix) { params.Prefix = prefix; }
    
    s3.listAllObjects(params, function(err, data) {
      if (err) { return cb(err); }
      console.log(data);
      
      for (var i = 0, len = data.Contents.length; i < len; i++) {
        contentFn(data.Contents[i]);
      }
    
      var prefixes = data.CommonPrefixes;
      (function iter(i, err) {
        if (err) { return cb(err); }
    
        var prefix = prefixes[i];
        if (!prefix) { return cb(); }
    
        list(prefix.Prefix, function(e) { iter(i + 1, e); } )
      })(0);
    });
  })(prefix, function(err) {
    if (err) { return doneFn(err); }
    
    // Fake to see if deeper structure match
    //contentFn({ Key: 'sync/windows/i386/SifteoSync-v0.9.9+39.5bb3769-setup.exe' });
    
    return doneFn();
  });
}


module.exports = Repository;
