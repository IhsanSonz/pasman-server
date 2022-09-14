import { Prisma } from '@prisma/client';
import { db } from 'utils/db';
import { encrypt } from 'utils/encryptionHandler';

export const findPasswordBySiteOrTitle = (id: string, query: string) => {
  let where: Object[] = [];
  if (!!query)
    query
      .trim()
      .split(' ')
      .map((q) => {
        where.push({ title: { contains: q as string } });
        where.push({ site: { contains: q as string } });
      });
  const or: Prisma.PasswordWhereInput = !!query
    ? {
        OR: [...where],
      }
    : {};
  return db.password.findMany({
    where: {
      AND: [{ userId: id }, { ...or }],
    },
  });
};

export const createPassword = (password: {
  title: string;
  site: string;
  encrypt: string;
  userId: string;
  pass: string;
}) => {
  const pass = encrypt(password.encrypt);
  password.pass = pass;
  delete (<{ encrypt?: string }>password).encrypt;
  return db.password.create({ data: password });
};

export const getEncryptedPassword = async (password: {
  userId: string;
  id: string;
  pass: string;
}): Promise<string | undefined> => {
  const { userId, id, pass } = password;
  const data = await db.password.findFirst({
    where: {
      AND: [{ id }, { pass }, { userId }],
    },
  });
  return data?.pass;
};
