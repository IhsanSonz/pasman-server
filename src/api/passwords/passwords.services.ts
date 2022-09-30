import { db } from 'utils/db';
import { encrypt } from 'utils/encryptionHandler';

export const findPasswordBySiteOrTitle = (id: string, query: string) => {
  query = query.trim().split(' ').join(' | ');
  return db.password.findMany({
    where: {
      AND: [
        { userId: id },
        {
          OR: [
            {
              title: {
                search: query,
              },
            },
            {
              site: {
                search: query,
              },
            },
          ],
        },
      ],
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
