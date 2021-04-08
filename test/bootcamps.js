// let mongoose = require('mongoose');
const User = require('../models/User');
const Bootcamp = require('../models/Bootcamp');
const { testBootcamps } = require('../testUtils/testData');

const {
  updateAdmin,
  registerUserAccount,
  registerPublisherAccount,
  registerAdminAccount
} = require('../testUtils/auth');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();
let userToken;
// let userId;
let publisherToken;
// let publisherId;
let adminToken;
// let adminId;
let bootcampId; // Need to pass to routes that require the id

chai.use(chaiHttp);

//Our parent block
describe('-- Bootcamp Testing --', () => {
  before(async () => {
    await User.deleteMany({});
    await Bootcamp.deleteMany({});
    const userResponse = await registerUserAccount();
    userToken = userResponse.userToken;
    // userId = userResponse.userId;

    const publisherResponse = await registerPublisherAccount();
    publisherToken = publisherResponse.userToken;
    // publisherId = publisherResponse.userId;

    const adminResponse = await registerAdminAccount();
    adminToken = adminResponse.userToken;
    // adminId = adminResponse.userId;
  });

  after(async () => {
    await User.deleteMany({});
    await Bootcamp.deleteMany({});
  });

  /*
   * Test the POST /api/v1/bootcamps route to create a new bootcamp for unauthorized user
   */
  describe('/POST Create a new bootcamp for an admin user with role "user"', () => {
    it('it should NOT create a new bootcamp for an unauthorized user', done => {
      // NOTE: admin user starts out with role 'user'
      chai
        .request('http://localhost:5000')
        .post('/api/v1/bootcamps')
        .send(testBootcamps[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/bootcamps route to create a new bootcamp for admin
   */
  describe('/POST Create a new bootcamp for an admin user with role "admin"', () => {
    before(async () => {
      // NOTE: admin user starts out with role 'user'
      await updateAdmin(); // update role to admin
    });
    it('it should create a new bootcamp for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .post('/api/v1/bootcamps')
        .send(testBootcamps[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          bootcampId = res.body.data._id;

          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/bootcamps route to create a new bootcamp for publisher
   */
  describe('/POST Create a new bootcamp for an user with role "publisher"', () => {
    it('it should create a new bootcamp for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .post('/api/v1/bootcamps')
        .send(testBootcamps[1])
        .set('Authorization', `Bearer ${publisherToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          done();
        });
    });
  });

  /*
   * Test the GET /api/v1/bootcamps route to get all bootcamp
   */
  describe('/GET Get all bootcamps', () => {
    it('it should get all bootcamps', done => {
      chai
        .request('http://localhost:5000')
        .get('/api/v1/bootcamps')
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('count');
          res.body.should.have.property('pagination');
          res.body.pagination.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  /*
   * Test the GET /api/v1/bootcamps/radius/:zipcode/:distance route to get all bootcamp within a radius of a zipcode
   */
  describe('/GET Get all bootcamps within a radius of a zipcode', () => {
    it('it should get all bootcamps within a radius of a zipcode', done => {
      chai
        .request('http://localhost:5000')
        .get('/api/v1/bootcamps/radius/02881/75')
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('count');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  /*
   * Test the GET /api/v1/bootcamps/:id route to get single bootcamp
   */
  describe('/GET Get single bootcamp', () => {
    it('it should get single bootcamp', done => {
      chai
        .request('http://localhost:5000')
        .get(`/api/v1/bootcamps/${bootcampId}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          done();
        });
    });
  });

  /*
   * Test the PUT /api/v1/bootcamps/:id route to update a bootcamp
   */
  describe('/PUT Update a bootcamp for an admin user', () => {
    it('it should update a bootcamp for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .put(`/api/v1/bootcamps/${bootcampId}`)
        .send({ housing: true })
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          done();
        });
    });
  });

  /*
   * Test the PUT /api/v1/bootcamps/:id route to update a bootcamp for unauthorized user
   */
  describe('/PUT Update a bootcamp for an unauthorized user', () => {
    it('it should NOT update a bootcamp for an unauthorized user', done => {
      chai
        .request('http://localhost:5000')
        .put(`/api/v1/bootcamps/${bootcampId}`)
        .send({ housing: true })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });
  });

  /*
   * Test the PUT /api/v1/bootcamps/:id route to update a bootcamp for a user who did not create the bootcamp
   */
  describe('/PUT Update a bootcamp for an a user who did not create the bootcamp', () => {
    it('it should NOT update a bootcamp for an a user who did not create the bootcamp', done => {
      chai
        .request('http://localhost:5000')
        .put(`/api/v1/bootcamps/${bootcampId}`)
        .send({ housing: true })
        .set('Authorization', `Bearer ${publisherToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });
  });

  /*
   * Test the DELETE /api/v1/bootcamps/:id route to update a bootcamp for unauthorized user
   */
  describe('/DELETE Delete a bootcamp for an unauthorized user', () => {
    it('it should NOT delete a bootcamp for an unauthorized user', done => {
      chai
        .request('http://localhost:5000')
        .delete(`/api/v1/bootcamps/${bootcampId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });
  });

  /*
   * Test the DELETE /api/v1/bootcamps/:id route to delete a bootcamp for a user who did not create the bootcamp
   */
  describe('/DELETE Delete a bootcamp for an a user who did not create the bootcamp', () => {
    it('it should NOT delete a bootcamp for an a user who did not create the bootcamp', done => {
      chai
        .request('http://localhost:5000')
        .delete(`/api/v1/bootcamps/${bootcampId}`)
        .set('Authorization', `Bearer ${publisherToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });
  });

  /*
   * Test the DELETE /api/v1/bootcamps/:id route to delete a bootcamp
   */
  describe('/DELETE Delete a bootcamp for an admin user', () => {
    it('it should delete a bootcamp for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .delete(`/api/v1/bootcamps/${bootcampId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          done();
        });
    });
  });
});
