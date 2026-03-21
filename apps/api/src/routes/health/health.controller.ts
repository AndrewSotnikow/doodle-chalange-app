import { Request, Response } from 'express';

const healthController = {
  getHealth: (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  },
};

export { healthController };
