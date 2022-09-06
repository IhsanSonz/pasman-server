import bcrypt from 'bcrypt';
import { db } from 'utils/db';

export const findUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUserByEmailAndPassword = (user: {
  email: string;
  password: string;
}) => {
  user.password = bcrypt.hashSync(user.password, 12);
  return db.user.create({ data: user });
};

export const findUserById = (id: string) => {
  return db.user.findUnique({
    where: {
      id,
    },
  });
};
