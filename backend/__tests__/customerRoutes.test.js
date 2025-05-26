const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const customerRoutes = require('../routes/customers');
const db = require('../database');

const app = express();
app.use(bodyParser.json());
app.use('/api/customers', customerRoutes);

afterAll(done => {
  db.close(done);
});

describe('Customer routes', () => {
  test('GET /api/customers/:id returns a customer', async () => {
    const res = await request(app).get('/api/customers/7');
    expect(res.statusCode).toBe(200);
    expect(res.body.first_name).toBe('Kerry');
    expect(res.body.last_name).toBe('Allison');
  });
});
