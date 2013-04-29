var spec = require('parsers/spec');


describe('spec parser', function() {
  
  describe('with a spec containing properties', function() {
    var parser = spec({ name: 'foo', version: '1.0', os: 'linux' });
    
    it('should set properties', function(done) {
      var pkg = {};
      pkg.path = '/pkg/foo-1.0.0.tgz';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.equal('foo');
        expect(pkg.version).to.equal('1.0');
        expect(pkg.os).to.equal('linux');
        done();
      });
    });
    
    it('should skip packages without path', function(done) {
      var pkg = {};
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.be.undefined;
        expect(pkg.version).to.be.undefined;
        expect(pkg.os).to.be.undefined;
        done();
      });
    });
  });
  
  describe('with a name and version pattern', function() {
    var parser = spec({ pattern: ':name-:version.:ext' });
    
    it('should parse name and version', function(done) {
      var pkg = {};
      pkg.path = '/pkg/foo-1.0.0.tgz';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.equal('foo');
        expect(pkg.version).to.equal('1.0.0');
        expect(pkg.ext).to.equal('tgz');
        done();
      });
    });
    
    it('should parse name and version with prefix', function(done) {
      var pkg = {};
      pkg.path = '/pkg/bar-v1.0.1.tgz';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.equal('bar');
        expect(pkg.version).to.equal('v1.0.1');
        expect(pkg.ext).to.equal('tgz');
        done();
      });
    });
    
    it('should not parse if version is not present', function(done) {
      var pkg = {};
      pkg.path = '/pkg/foo.tgz';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.be.undefined;
        expect(pkg.version).to.be.undefined;
        expect(pkg._ext).to.be.undefined;
        done();
      });
    });
  });
  
  describe('with a name and prefixed version pattern', function() {
    var parser = spec({ pattern: ':name-v:version.:ext' });
    
    it('should parse name and version with prefix', function(done) {
      var pkg = {};
      pkg.path = '/pkg/bar-v1.0.1.tgz';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.equal('bar');
        expect(pkg.version).to.equal('1.0.1');
        expect(pkg.ext).to.equal('tgz');
        done();
      });
    });
    
    it('should not parse name and version without prefix', function(done) {
      var pkg = {};
      pkg.path = '/pkg/foo-1.0.0.tgz';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.be.undefined;
        expect(pkg.version).to.be.undefined;
        expect(pkg.ext).to.be.undefined;
        done();
      });
    });
  });
  
  describe('with Debian-style pattern', function() {
    var parser = spec({ pattern: ':name_:version-:revision_:arch.deb' });
    
    it('should parse valid file name', function(done) {
      var pkg = {};
      pkg.path = '/a/autofs/autofs_5.0.7-3_amd64.deb';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.equal('autofs');
        expect(pkg.version).to.equal('5.0.7');
        expect(pkg.revision).to.equal('3');
        expect(pkg.arch).to.equal('amd64');
        done();
      });
    });
  });
  
  describe('with RPM-style pattern', function() {
    var parser = spec({ pattern: ':name-:version-:release.:arch.rpm' });
    
    it('should parse valid file name', function(done) {
      var pkg = {};
      pkg.path = '/RPMS/autofs-3.1.7-36.i386.rpm';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.equal('autofs');
        expect(pkg.version).to.equal('3.1.7');
        expect(pkg.release).to.equal('36');
        expect(pkg.arch).to.equal('i386');
        done();
      });
    });
  });
  
  describe('with a spec containing properties and pattern', function() {
    var parser = spec({ name: 'foo', version: '1.0', os: 'linux', pattern: ':name-:version.:ext' });
    
    it('should prefer explicit properties over pattern', function(done) {
      var pkg = {};
      pkg.path = '/pkg/FooBar-1.0-2.tgz';
    
      parser(pkg, function(err) {
        if (err) { return done(err); }
        expect(pkg.name).to.equal('foo');
        expect(pkg.version).to.equal('1.0');
        expect(pkg.os).to.equal('linux');
        done();
      });
    });
  });
  
});
