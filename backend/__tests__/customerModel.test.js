const customerModel = require('../models/customerModel');
const db = require('../database');

describe('customerModel', () => {
  afterAll(done => {
    db.close(done);
  });

  test('getCustomerById returns existing customer', done => {
    customerModel.getCustomerById(7, (err, customer) => {
      expect(err).toBeNull();
      expect(customer).toBeDefined();
      expect(customer.first_name).toBe('Kerry');
      expect(customer.last_name).toBe('Allison');
      done();
    });
  });
});
