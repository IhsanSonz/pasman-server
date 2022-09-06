import { db } from 'utils/db';
import { hashToken } from 'utils/hashToken';
import crypto from 'crypto';

// used when we create a refresh token.
export const addRefreshTokenToWhiteList = ({
  jti,
  refreshToken,
  userId,
}: {
  jti: string;
  refreshToken: crypto.BinaryLike;
  userId: string;
}) => {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};

// used to check if the token sent by the client is in the database.
export const findRefreshTokenById = (id: string) => {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

// soft delete tokens after usage.
export const deleteRefreshToken = (id: string) => {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = (userId: string) => {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
};
