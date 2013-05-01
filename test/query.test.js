var Query = require('query');


describe('Query', function() {

  describe('by name', function() {
    var q = new Query('foo')
    
    it('should parse correctly', function() {
      expect(q.params.name).to.equal('foo');
    });
    
    it('should match matching package', function() {
      var pkg = {
        name: 'foo',
        version: '1.0.1'
      }
      expect(q.match(pkg)).to.be.true;
    });
    
    it('should not match non-matching package', function() {
      var pkg = {
        name: 'bar',
        version: '1.0.1'
      }
      expect(q.match(pkg)).to.be.false;
    });
  });
  
  describe('by name and version', function() {
    var q = new Query('foo@1.0')
    
    it('should parse correctly', function() {
      expect(q.params.name).to.equal('foo');
      expect(q.params.version).to.equal('1.0');
    });
    
    it('should match matching package', function() {
      var pkg = {
        name: 'foo',
        version: '1.0'
      }
      expect(q.match(pkg)).to.be.true;
    });
    
    it('should not match non-matching package', function() {
      var pkg = {
        name: 'foo',
        version: '1.0.1'
      }
      expect(q.match(pkg)).to.be.false;
    });
  });
  
  describe('by name and os object', function() {
    var q = new Query({ name: 'foo', os: 'linux' })
    
    it('should parse correctly', function() {
      expect(q.params.name).to.equal('foo');
      expect(q.params.os).to.equal('linux');
    });
    
    it('should match matching package', function() {
      var pkg = {
        name: 'foo',
        os: 'linux'
      }
      expect(q.match(pkg)).to.be.true;
    });
    
    it('should not match non-matching package', function() {
      var pkg = {
        name: 'foo',
        os: 'windows'
      }
      expect(q.match(pkg)).to.be.false;
    });
  });
  
});
