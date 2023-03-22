import { authMiddleware } from './auth-middleware';
import { Request, Response, NextFunction } from 'express';
import { CustomHTTPError } from '../../utils/errors/custom-http-error';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

describe('Given an authMiddleware function', () => {
  test('When no JWT token is provided, then it should throw an 401 error', () => {
    const mockReq = { headers: {} } as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    expect(() => {
      authMiddleware(mockReq, mockRes, mockNext);
    }).toThrow(new CustomHTTPError(401, 'Unauthorized'));
  });

  test('When a JWT_SECRET environment variable is not defined, then it should throw an 500 error', () => {
    const mockReq = {
      headers: { authorization: 'Bearer jwtToken' },
    } as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn() as NextFunction;
    process.env.JWT_SECRET = '';

    expect(() => {
      authMiddleware(mockReq, mockRes, mockNext);
    }).toThrow(
      new CustomHTTPError(
        500,
        'JWT_SECRET environment variable is not defined',
      ),
    );
  });

  test('When a JWT token is provided and valid, then it should set res.locals.id and call next', () => {
    const id = '641b1abe767aa1b72eab420c';
    process.env.JWT_SECRET = 'secret';
    const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET!);
    const mockReq = {
      headers: { authorization: `Bearer ${jwtToken}` },
    } as Request;
    const mockRes = { locals: {} } as Response;
    const mockNext = jest.fn() as NextFunction;

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.locals.id).toBe(id);
    expect(mockNext).toHaveBeenCalled();
  });
});
