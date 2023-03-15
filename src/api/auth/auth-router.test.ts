import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import connectDB from '../../database/connection';
import app from '../../app';
import { UserModel } from '../users/user-schema';
import { encryptPassword } from './auth-utils';
describe('Given an app with auth-router', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUrl = mongoServer.getUri();
    await connectDB(mongoUrl);
  });

  afterAll(async () => {
    await mongoServer.stop();
    await mongoose.connection.close();
  });

  describe('When a user wants to log in with an existing email and pasasword', () => {
    test('Then it should be logged in', async () => {
      const user = {
        email: 'antonio@gmail.com',
        password: 'secreto1234',
      };
      const userDb = { ...user, password: encryptPassword(user.password) };
      await UserModel.create(userDb);

      await request(app).post('/auth/login').send(user).expect(201);
    });
  });

  describe('When a user wants to log in with an unexisting email', () => {
    test('Then it should a 404', async () => {
      const notExistUser = {
        email: 'antoio@gmail.com',
        password: 'secret12',
      };
      await request(app).post('/auth/login').send(notExistUser).expect(404);
    });
  });
});
