import express, { NextFunction, Request, Response } from 'express';
import { isAuthenticated } from 'middlewares';
import {
  createPassword,
  findPasswordBySiteOrTitle,
  getEncryptedPassword,
} from 'api/passwords/passwords.services';
import { make } from 'simple-body-validator';
import { decrypt } from 'utils/encryptionHandler';

const router = express.Router();

router.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.payload;
      const { q } = req.body;
      let passwords = await findPasswordBySiteOrTitle(userId, q);
      res.json(passwords);
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
);

router.post(
  '/store',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rules = {
        title: 'required|string',
        site: 'string',
        encrypt: 'required|string',
      };
      const validator = make(req.body, rules);
      if (!validator.stopOnFirstFailure().validate()) {
        res.status(400);
        throw new Error(validator.errors().first());
      }

      const { userId } = req.payload;
      const { title, site, encrypt } = req.body;
      const password = await createPassword({
        title,
        site,
        encrypt,
        userId,
        pass: '',
      });
      res.json(password);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/decrypt',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rules = {
        id: 'required|string',
        pass: 'required|string',
      };
      const validator = make(req.body, rules);
      if (!validator.stopOnFirstFailure().validate()) {
        res.status(400);
        throw new Error(validator.errors().first());
      }

      const { userId } = req.payload;
      const { id, pass } = req.body;
      const encryptedPassword = await getEncryptedPassword({
        userId,
        id,
        pass,
      });
      if (!encryptedPassword) {
        res.status(404);
        throw new Error('The requested resource was not found.');
      }
      const decrypted = decrypt(encryptedPassword!);
      res.json({
        data: decrypted,
        error: false,
        message: 'Password decrypted.',
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
