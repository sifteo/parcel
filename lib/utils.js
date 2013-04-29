/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *     
 *     utils.merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

exports.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};


/**
 * Normalize the given path template,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @param  {Boolean} sensitive
 * @param  {Boolean} strict
 * @return {RegExp}
 * @api private
 */

exports.pathRegexp = function(path, keys, sensitive, strict) {
  if (toString.call(path) == '[object RegExp]') return path;
  if (Array.isArray(path)) path = '(' + path.join('|') + ')';
  path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:([A-Za-z0-9]+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
      // NOTE: The above replacement is modified from Express.  The original was:
      //       /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g
      keys.push({ name: key, optional: !! optional });
      slash = slash || '';
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
        + (optional || '')
        + (star ? '(/*)?' : '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
  return new RegExp('^' + path + '$', sensitive ? '' : 'i');
}

exports.patternSubstitute = function(pattern, keys, params) {
  var path = pattern;
  keys.forEach(function(key) {
    if (!key.optional) {
      if (!params[key.name]) { throw new Error('Unable to substitute :' + key.name + ' in pattern ' + pattern); }
      path = path.replace(':' + key.name, params[key.name]);
    } else {
      var replacement = params[key.name] ? '$1' + params[key.name] : '';
      path = path.replace(new RegExp('(\\.?\\/?):' + key.name + '\\?'), replacement);
    }
  });
  
  return path;
}
