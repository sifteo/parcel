function Package(content) {
  this.key = content.Key;
  this.size = content.Size;
  this.lastModified = content.LastModified;
}

Package.prototype.sync = function(s3, bucket, cb) {
  var params = {
    Bucket: bucket,
    Key: this.key
  }
  
  var self = this;
  s3.headObject(params, function(err, data) {
    if (err) { return cb(err); }
    self.md5 = data.Metadata['package-checksum-md5'];
    self.minOSVersion = data.Metadata['package-min-os-version'];
    return cb();
  });
}


module.exports = Package;
