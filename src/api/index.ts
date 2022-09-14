import express from 'express';
import auth from 'api/auth/auth.routes';
import users from 'api/users/users.routes';
import passwords from 'api/passwords/passwords.routes';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/passwords', passwords);

export default router;
