function Package(content) {
  this.key = content.Key;
  this.size = content.Size;
  this.lastModified = content.LastModified;
}


module.exports = Package;
