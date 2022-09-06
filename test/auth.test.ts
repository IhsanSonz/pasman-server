import request from 'supertest';
import { db } from 'utils/db';

import app from '../src/app';

beforeAll(async () => {
  await db.$connect();
  // drop the schema
  await db.user.deleteMany({});
});

afterAll(async () => {
  await db.$disconnect();
});

describe('POST /api/v1/auth/register', () => {
  it('responds with a json message, user registered', (done) => {
    request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@mail.com',
        password: 'test',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        done();
      });
  });
  it('responds with an error because password not found on body', (done) => {
    request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@mail.com',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toMatchObject({
          message: 'You must provide an email and a password.',
        });
        done();
      });
  });
  it('responds with an error because email not found on body', (done) => {
    request(app)
      .post('/api/v1/auth/register')
      .send({
        password: 'test',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toMatchObject({
          message: 'You must provide an email and a password.',
        });
        done();
      });
  });
  it('responds with an error because email already registered', (done) => {
    request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@mail.com',
        password: 'test',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toMatchObject({
          message: 'Email already in use.',
        });
        done();
      });
  });
});
