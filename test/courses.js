// let mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const { testBootcamps, testCourses } = require('../testUtils/testData');

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
let courseId;

chai.use(chaiHttp);

const addBootcamps = async publisherId => {
  for (let i = 0; i < testBootcamps.length; i++) {
    testBootcamps[i].user = publisherId;
    const response = await Bootcamp.create(testBootcamps[i]);
    bootcampIds.push(response._id);
  }
};

//Our parent block
describe('-- Course Testing --', () => {
  before(async () => {
    await User.deleteMany({});
    await Course.deleteMany({});
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
    await Course.deleteMany({});
    await Bootcamp.deleteMany({});
  });

  // /*
  //  * Test the POST /api/v1/courses route to create a new course for unauthorized user
  //  */
  describe('/POST Create a new course for a bootcamp for an admin user with role "user"', () => {
    it('it should NOT create a new course for an unauthorized user', done => {
      // NOTE: admin user starts out with role 'user'
      chai
        .request('http://localhost:5000')
        .post('/api/v1/courses')
        .send(testCourses[0])
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
   * Test the POST /api/v1/courses route to create a new course for admin
   */
  describe('/POST Create a new course for an admin user with role "admin"', () => {
    before(async () => {
      // NOTE: admin user starts out with role 'user'
      await updateAdmin(); // update role to admin
    });
    it('it should create a new course for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .post(`/api/v1/bootcamps/${bootcampIds[0]}/courses`)
        .send(testCourses[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }

          courseId = res.body.data._id;

          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          done();
        });
    });
  });

  /*
   * Test the POST /api/v1/courses route to create a new course for publisher
   */
  describe('/POST Create a new course for an publisher user with role "publisher"', () => {
    it('it should create a new course for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .post(`/api/v1/bootcamps/${bootcampIds[1]}/courses`)
        .send(testCourses[1])
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
   * Test the GET /api/v1/courses route to get all courses
   */
  describe('/GET Get all courses', () => {
    it('it should get all courses', done => {
      chai
        .request('http://localhost:5000')
        .get('/api/v1/courses')
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
   * Test the GET /api/v1/courses route to get all courses for a bootcamp
   */
  describe('/GET Get all courses for a bootcamp', () => {
    it('it should get all courses for a bootcamp', done => {
      chai
        .request('http://localhost:5000')
        .get(`/api/v1/bootcamps/${bootcampIds[1]}/courses`)
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
   * Test the GET /api/v1/courses/:id route to get single course
   */
  describe('/GET Get single course', () => {
    it('it should get single course', done => {
      chai
        .request('http://localhost:5000')
        .get(`/api/v1/courses/${courseId}`)
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
   * Test the PUT /api/v1/courses/:id route to update a course (unauthorized user)
   */
  describe('/PUT Update a course for an unauthorized user', () => {
    it('it NOT should update a course for an unauthorized user', done => {
      chai
        .request('http://localhost:5000')
        .put(`/api/v1/courses/${courseId}`)
        .send({ minimumSkill: 'advanced' })
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
   * Test the PUT /api/v1/courses/:id route to update a course
   */
  describe('/PUT Update a course for an admin user', () => {
    it('it should update a course for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .put(`/api/v1/courses/${courseId}`)
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
   * Test the DELETE /api/v1/courses/:id route to delete a course (unauthorized user)
   */
  describe('/DELETE delete a course for an unauthorized user', () => {
    it('it NOT should delete a course for an unauthorized user', done => {
      chai
        .request('http://localhost:5000')
        .delete(`/api/v1/courses/${courseId}`)
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
   * Test the DELETE /api/v1/courses/:id route to delete a course
   */
  describe('/DELETE Delete a course for an admin user', () => {
    it('it should delete a course for an authorized user', done => {
      chai
        .request('http://localhost:5000')
        .delete(`/api/v1/courses/${courseId}`)
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
