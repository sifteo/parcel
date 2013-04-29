/**
 * List all objects in a bucket.
 *
 * If necessary, this function will do paged requests and accumulate responses
 * into a single result.
 *
 * @param {Object} params
 * @param {Function} callback
 * @api public
 */
exports.listAllObjects = function(params, callback) {
  var self = this
    , result;
  
  function next(marker) {
    if (marker) { params.Marker = marker; }
    
    self.listObjects(params, function(err, data) {
      if (err) { return callback(err); }
    
      if (!result) {
        // initial response
        result = data;
      } else {
        // paged response, accumlate result
        result.Contents = (result.Contents || []).concat(data.Contents);
        result.CommonPrefixes = (result.CommonPrefixes || []).concat(data.CommonPrefixes);
      }
    
      if (data.NextMarker) {
        next(data.NextMarker);
      } else {
        callback(null, result);
      }
    });
  }
  next();
}
