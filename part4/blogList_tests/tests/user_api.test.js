const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

describe('User creation', () => {
  test('creation fails with too short username or password', async () => {
    const newUser = { username: 'ab', password: '123', name: 'John Doe' };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(0);
  });

});
