const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const userRouter = require("../routers/userRouter");
describe('User Route', () => {
    const app = express();
    app.use('/user', userRouter);
  
    it('should respond with register message', async () => {
      const response = await request(app).get('/user/register');
      console.log(response);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('body');
      expect(response.body.message).to.equal('register');
    });
  });