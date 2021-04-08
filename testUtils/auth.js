const User = require('../models/User');
const { getIdFromToken } = require('../middleware/auth');
const { testAccounts } = require('./testData');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

exports.updateAdmin = async () => {
  await User.findOneAndUpdate(
    { email: 'admin@gmail.com' },
    { $set: { role: 'admin' } }
  );
};

exports.registerUserAccount = async () => {
  const response = await chai
    .request('http://localhost:5000')
    .post('/api/v1/auth/register')
    .send(testAccounts[0]);

  const userId = getIdFromToken(response.body.token);
  const userToken = response.body.token;
  return { userId, userToken };
};

exports.registerPublisherAccount = async () => {
  const response = await chai
    .request('http://localhost:5000')
    .post('/api/v1/auth/register')
    .send(testAccounts[1]);

  const userId = getIdFromToken(response.body.token);
  const userToken = response.body.token;

  return { userId, userToken };
};

exports.registerAdminAccount = async () => {
  const response = await chai
    .request('http://localhost:5000')
    .post('/api/v1/auth/register')
    .send(testAccounts[2]);

  const userId = getIdFromToken(response.body.token);
  const userToken = response.body.token;
  return { userId, userToken };
};
