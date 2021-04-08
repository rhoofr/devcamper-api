// let mongoose = require('mongoose');
const User = require('../models/User');

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
// let publisherToken;
let adminToken;
let userId; // Need to pass to routes that require the id

chai.use(chaiHttp);

//Our parent block
describe('-- User Testing --', () => {
  before(async () => {
    await User.deleteMany({});
    const loginResponse = await registerUserAccount();
    userId = loginResponse.userId;
    userToken = loginResponse.userToken;
    await registerPublisherAccount();
    const adminResponse = await registerAdminAccount();
    adminToken = adminResponse.userToken;
  });

  after(async () => {
    await User.deleteMany({});
  });

  /*
   * Test the GET /api/v1/users route with role user
   */
  describe('/GET Get all users should fail if requestor has role of user', () => {
    it('it NOT should Get all users if requestor has role of user', done => {
      chai
        .request('http://localhost:5000')
        .get('/api/v1/users')
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
   * Test the GET /api/v1/users route with role admin
   */
  describe('/GET Get all users should succeed if requestor has role of admin', () => {
    before(async () => {
      await updateAdmin(); // update role to admin
    });
    it('it should Get all users if requestor has role of admin', done => {
      chai
        .request('http://localhost:5000')
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
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
   * Test the POST /api/v1/users route with role user
   */
  describe('/POST Create new user should fail if requestor has role of user', () => {
    it('it NOT should create new user if requestor has role of user', done => {
      chai
        .request('http://localhost:5000')
        .post('/api/v1/users')
        .send({
          name: 'New User',
          email: 'new@gmail.com',
          password: 'password',
          role: 'user'
        })
        .set('Authorization', `Bearer ${userToken}`)
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
   * Test the POST /api/v1/users route with role admin
   */
  describe('/POST Create new user should succeed if requestor has role of admin', () => {
    it('it should create new user if requestor has role of admin', done => {
      chai
        .request('http://localhost:5000')
        .post('/api/v1/users')
        .send({
          name: 'New User',
          email: 'new@gmail.com',
          password: 'password',
          role: 'user'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          done();
        });
    });
  });

  /*
   * Test the GET /api/v1/users/:id route with role admin
   */
  describe('/GET Get specific user data by an admin', () => {
    it('it should Get the user data if requestor has role of admin', done => {
      chai
        .request('http://localhost:5000')
        .get(`/api/v1/users/${userId}`)
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
   * Test the DELETE /api/v1/users/:id route with role admin
   */
  describe('/DELETE delete specific user data by an admin', () => {
    it('it should delete the user if requestor has role of admin', done => {
      chai
        .request('http://localhost:5000')
        .delete(`/api/v1/users/${userId}`)
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
