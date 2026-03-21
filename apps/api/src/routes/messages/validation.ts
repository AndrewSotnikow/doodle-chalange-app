import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validateBody = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedError = {
          statusCode: 400,
          message: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
        next(formattedError);
        return;
      }

      next(error);
      return;
    }
  };
};

const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // @ts-expect-error - already validated via zod
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedError = {
          statusCode: 400,
          message: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
        next(formattedError);
        return;
      }

      next(error);
      return;
    }
  };
};

export { validateBody, validateQuery };
