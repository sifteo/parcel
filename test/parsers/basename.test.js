var basename = require('parsers/basename');


describe('basename parser', function() {
  
  describe('with defaults', function() {
    var parser = basename();
    
    it('should set filename', function(done) {
      var pkg = {};
      pkg.path = '/pkg/foo-1.0.0.tgz';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.filename).to.equal('foo-1.0.0.tgz');
        done();
      });
    });
    
    it('should skip packages without path', function(done) {
      var pkg = {};
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.filename).to.be.undefined;
        done();
      });
    });
  });
  
});
