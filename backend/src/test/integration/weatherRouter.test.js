const mocha = require('mocha');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../index');

mocha.describe('routes : weather', () => {
  mocha.describe('should return weather for target city (default: Helsinki)', () => {
    mocha.it('should return weather data', (done) => {
      chai.request(server)
      .get('/api/weather/')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.include.keys(
            'id', 'main', 'description', 'icon'
        );
        done();
      });
    });
  });
  mocha.describe('should return weather data for coordinates', () => {
    mocha.it('should return weather data for Paris', (done) => {
      const testCoords = '48.8534100,2.3488000';
      chai.request(server)
        .get(`/api/weather/${testCoords}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          const resBody = res.body;
          resBody.should.include.keys(
              'weather', 'country', 'name'
          );
          resBody.country.should.equal('FR');
          resBody.name.should.equal('Paris');
          done();
        });
    });

    mocha.it('should return empty object because of wrong format', (done) => {
      const testCoords = '48.8534100;2.3488000';
      chai.request(server)
        .get(`/api/weather/${testCoords}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          // eslint-disable-next-line no-unused-expressions
          chai.expect(res.body).to.be.an('object').that.is.empty;
          done();
        });
    });
  });
});
