const configuration =
require('../knexfile')['test'];
const database = require('knex')(configuration);

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return a home page', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.have.string('Garage Bin')
      done();
    });
  });
  it('should return 404 if endpoint not found', (done) => {
    chai.request(server)
    .get('/fakepath')
    .end((err, res) => {
      should.exist(err);
      res.should.have.status(404);
      done();
    });
  });
});

describe('API routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(err => console.log(err));
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(err => console.log(err));
  });

  describe('GET /api/v1/items', () => {
    it('should return all items', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.length.should.equal(2);
        res.body.forEach(item => {
          item.should.include.keys('id', 'name', 'reason', 'cleanliness')
        })
        done();
      });
    });
  });
  describe('POST /api/v1/items', () => {
    it('should create a new item in the database and retun the new item', (done) => {
      chai.request(server)
      .post('/api/v1/items')
      .send({
	      name: 'paint',
	      reason: 'lazy',
	      cleanliness: 'Sparkling'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        res.body.name.should.equal('paint')
        res.body.reason.should.equal('lazy')
        res.body.cleanliness.should.equal('Sparkling')
        chai.request(server)
        .get('/api/v1/items')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body[2].should.include.keys('id',
            'name', 'reason', 'cleanliness');
          res.body[2].name.should.equal('paint');
          res.body[2].reason.should.equal('lazy');
          res.body[2].cleanliness.should.equal('Sparkling');
          done();
        })
      })
    })
  })
})
