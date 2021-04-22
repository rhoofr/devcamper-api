// let mongoose = require('mongoose');
const User = require('../models/User');
const { testAccounts } = require('../testUtils/testData');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();
let token;

chai.use(chaiHttp);

//Our parent block
describe('-- Auth Testing --', () => {
  before(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
  });

  /*
   * Test the POST /api/v1/register route
   */
  describe('/POST Register new user with role of user', () => {
    it('it should register a new user with role of user', done => {
      chai
        .request('http://localhost:5000')
        .post('/api/v1/auth/register')
        .send(testAccounts[0])
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/register route
   */
  describe('/POST Register new user with role of user that has already registered', () => {
    it('it should NOT register a new user with role of user that has already registered', done => {
      chai
        .request('http://localhost:5000')
        .post('/api/v1/auth/register')
        .send(testAccounts[0])
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('error');
          res.body.should.have
            .property('error')
            .eql('Duplicate field value entered');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/register route
   */
  describe('/POST Register new user with role of publisher', () => {
    it('it should register a new user with role of publisher', done => {
      chai
        .request('http://localhost:5000')
        .post('/api/v1/auth/register')
        .send(testAccounts[1])
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/register route
   */
  describe('/POST Register new user with role of admin', () => {
    it('it should NOT register a new user with role of admin', done => {
      testAccounts[2].role = 'admin';
      chai
        .request('http://localhost:5000')
        .post('/api/v1/auth/register')
        .send(testAccounts[2])
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/register route
   */
  describe('/POST Register new admin user with role of user', () => {
    it('it should register a new admin user with role of user', done => {
      testAccounts[2].role = 'user';
      chai
        .request('http://localhost:5000')
        .post('/api/v1/auth/register')
        .send(testAccounts[2])
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/login route
   */
  describe('/POST Login user', () => {
    it('it should login a user', done => {
      chai
        .request('http://localhost:5000')
        .post('/api/v1/auth/login')
        .send({
          email: testAccounts[0].email,
          password: testAccounts[0].password
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          token = res.body.token;
          // const cookie = res.headers['set-cookie'][0];
          // console.log(cookie);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/login route
   */
  describe('/POST Login invalid user', () => {
    it('it should NOT login a user with invalid credentials', done => {
      chai
        .request('http://localhost:5000')
        .post('/api/v1/auth/login')
        .send({
          email: 'notauser@gmail.com',
          password: testAccounts[0].password
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('error').eql('Invalid credentials');
          done();
        });
    });
  });

  /*
   * Test the GET /api/v1/me route
   */
  describe('/GET user information', () => {
    it('it should get the information for a valid/authenticated user', done => {
      chai
        .request('http://localhost:5000')
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('user');
          res.body.user.should.be.a('object');
          res.body.user.should.have.property('role');
          res.body.user.should.have.property('_id');
          res.body.user.should.have.property('name');
          res.body.user.should.have.property('email');
          done();
        });
    });
  });

  /*
   * Test the GET /api/v1/logout route
   */
  describe('/GET logout user', () => {
    it('it should logout a user', done => {
      chai
        .request('http://localhost:5000')
        .get('/api/v1/auth/logout')
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          const cookie = res.headers['set-cookie'][0];
          // console.log(cookie);
          cookie.includes('token=none').should.eql(true);
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
   * Test the PUT /api/v1/updatedetails route
   */
  describe('/PUT update details user', () => {
    it('it should update details for a user using a cookie', done => {
      const update = { email: 'user@gmail.com', name: 'Bob Smith' };
      chai
        .request('http://localhost:5000')
        .put('/api/v1/auth/updatedetails')
        .send(update)
        .set('Cookie', `token=${token}`)
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
   * Test the PUT /api/v1/updatepassword route
   */
  describe('/PUT update password user', () => {
    it('it should update password for a user', done => {
      const update = { currentPassword: 'password', newPassword: '123456' };
      chai
        .request('http://localhost:5000')
        .put('/api/v1/auth/updatepassword')
        .send(update)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/forgotpassword route
   */
  describe('/POST forgot password user', () => {
    it('it should send response for forgot password for a user', done => {
      const update = { email: 'user@gmail.com' };
      chai
        .request('http://localhost:5000')
        .post('/api/v1/auth/forgotpassword')
        .send(update)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('data');
          res.body.data.should.be.a('string');
          res.body.should.have.property('data').eql('Email sent');
          done();
        });
    });
  });
});
