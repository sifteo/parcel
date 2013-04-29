var parcel = require('index');


describe('Parcel', function() {
    
  it('should export default singleton', function() {
    expect(parcel).to.be.an('object');
    expect(parcel.constructor.name).to.equal('Parcel');
  });
  
});
