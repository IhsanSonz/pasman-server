import express, { NextFunction, Request, Response } from 'express';
import { isAuthenticated } from 'middlewares';
import { findUserById } from 'api/users/users.services';

const router = express.Router();

router.get(
  '/profile',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.payload;
      console.log(userId);
      const user = await findUserById(userId);
      delete (<{ password?: string }>user).password;
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
