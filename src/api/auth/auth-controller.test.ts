import { UserModel } from './../users/user-schema';
import { loginUserController } from './auth-controller';
import { Request, Response } from 'express';
import { encryptPassword, generateJWTToken } from './auth-utils';

describe('Given a loginUserController', () => {
  const request = {
    body: {
      email: 'antonio@gmail.com',
      password: 'secreto123',
    },
  } as Partial<Request>;

  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    sendStatus: jest.fn(),
  } as Partial<Response>;

  const tokenJWT = {
    accessToken: generateJWTToken(request.body.email),
  };
  const userLogin = {
    email: 'antonio@gmail.com',
    password: encryptPassword('secreto123'),
  };

  test('When the user exits, it should be respond with a access token', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(userLogin),
    }));
    await loginUserController(
      request as Request,
      response as Response,
      jest.fn(),
    );
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: 'antonio@gmail.com',
      password: '508b10f89ef1aa1f7dd4445e63225854',
    });
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(tokenJWT);
  });
  test('When the user does not exits, it shoud be responde with status 404 ', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));
    await loginUserController(
      request as Request,
      response as Response,
      jest.fn(),
    );
    expect(response.sendStatus).toHaveBeenCalledWith(404);
  });
});