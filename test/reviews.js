// let mongoose = require('mongoose');
const User = require('../models/User');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const { testBootcamps, testReviews } = require('../testUtils/testData');

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
let userId;
let publisherToken;
let publisherId;
let adminToken;
let adminId;
let bootcampIds = [];
let reviewId;

chai.use(chaiHttp);

const addBootcamps = async publisherId => {
  for (let i = 0; i < testBootcamps.length; i++) {
    testBootcamps[i].user = publisherId;
    const response = await Bootcamp.create(testBootcamps[i]);
    bootcampIds.push(response._id);
  }
};

//Our parent block
describe('-- Review Testing --', () => {
  before(async () => {
    await User.deleteMany({});
    await Review.deleteMany({});
    await Bootcamp.deleteMany({});

    const userResponse = await registerUserAccount();
    userToken = userResponse.userToken;
    userId = userResponse.userId;

    const publisherResponse = await registerPublisherAccount();
    publisherToken = publisherResponse.userToken;
    publisherId = publisherResponse.userId;

    const adminResponse = await registerAdminAccount();
    adminToken = adminResponse.userToken;
    adminId = adminResponse.userId;

    await addBootcamps(publisherId);
  });

  after(async () => {
    await User.deleteMany({});
    await Review.deleteMany({});
    await Bootcamp.deleteMany({});
  });

  // /*
  //  * Test the POST /api/v1/bootcamps/:bootcampId/reviews route to create a new review for unauthorized user
  //  */
  describe('/POST Create a new review for a bootcamp for a user with role "publisher"', () => {
    it('it should NOT create a new review for an unauthorized user', done => {
      chai
        .request('http://localhost:5000')
        .post(`/api/v1/bootcamps/${bootcampIds[0]}/reviews`)
        .send(testReviews[0])
        .set('Authorization', `Bearer ${publisherToken}`)
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
   * Test the POST /api/v1/bootcamps/:bootcampId/reviews route to create a new review for admin
   */
  describe('/POST Create a new review for an admin user with role "admin"', () => {
    before(async () => {
      // NOTE: admin user starts out with role 'user'
      await updateAdmin(); // update role to admin
    });
    it('it should create a new review for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .post(`/api/v1/bootcamps/${bootcampIds[0]}/reviews`)
        .send(testReviews[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          // console.log(res);
          reviewId = res.body.data._id;

          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/reviews route to create a new review for user
   */
  describe('/POST Create a new review for an user with role "user"', () => {
    it('it should create a new review for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .post(`/api/v1/bootcamps/${bootcampIds[1]}/reviews`)
        .send(testReviews[1])
        .set('Authorization', `Bearer ${userToken}`)
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
   * Test the GET /api/v1/reviews route to get all reviews
   */
  describe('/GET Get all reviews', () => {
    it('it should get all reviews', done => {
      chai
        .request('http://localhost:5000')
        .get('/api/v1/reviews')
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
   * Test the GET /api/v1/reviews route to get all reviews for a bootcamp
   */
  describe('/GET Get all reviews for a bootcamp', () => {
    it('it should get all reviews for a bootcamp', done => {
      chai
        .request('http://localhost:5000')
        .get(`/api/v1/bootcamps/${bootcampIds[1]}/reviews`)
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
   * Test the GET /api/v1/reviews/:id route to get single review
   */
  describe('/GET Get single review', () => {
    it('it should get single review', done => {
      chai
        .request('http://localhost:5000')
        .get(`/api/v1/reviews/${reviewId}`)
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
   * Test the PUT /api/v1/reviews/:id route to update a review (unauthorized user)
   */
  describe('/PUT Update a review for an unauthorized user', () => {
    it('it NOT should update a review for an unauthorized user', done => {
      chai
        .request('http://localhost:5000')
        .put(`/api/v1/reviews/${reviewId}`)
        .send({ minimumSkill: 'advanced' })
        .set('Authorization', `Bearer ${publisherToken}`)
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
   * Test the PUT /api/v1/reviews/:id route to update a review
   */
  describe('/PUT Update a review for an admin user', () => {
    it('it should update a review for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .put(`/api/v1/reviews/${reviewId}`)
        .send({ minimumSkill: 'advanced' })
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
   * Test the DELETE /api/v1/reviews/:id route to delete a review (unauthorized user)
   */
  describe('/DELETE delete a review for an unauthorized user', () => {
    it('it NOT should delete a review for an unauthorized user', done => {
      chai
        .request('http://localhost:5000')
        .delete(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${publisherToken}`)
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
   * Test the DELETE /api/v1/reviews/:id route to delete a review
   */
  describe('/DELETE Delete a review for an authorized user', () => {
    it('it should delete a review for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .delete(`/api/v1/reviews/${reviewId}`)
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
