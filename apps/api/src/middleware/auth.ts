import { Request, Response, NextFunction, RequestHandler } from 'express';

import { CONFIG } from '../config/config.js';

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: 'Authorization header missing',
      statusCode: 401,
      error: 'Unauthorized',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (token !== CONFIG.auth.token) {
    res.status(401).json({
      message: 'Invalid token',
      statusCode: 401,
      error: 'Unauthorized',
    });
    return;
  }

  next();
};
