function Query(str) {
  this.params = {};
  
  var comps = str.split('@');
  if (comps.length == 1) {
    this.params.name = comps[0];
  } else if (comps.length == 2) {
    this.params.name = comps[0];
    this.params.version = comps[1];
  }
}

Query.prototype.match = function(pkg) {
  var keys = Object.keys(this.params)
    , key, val;
  
  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i]
    val = this.params[key];
    
    if (pkg[key] != val) return false; 
  }
  
  return true;
}


module.exports = Query;
