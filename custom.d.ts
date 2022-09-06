declare namespace Express {
  export interface Request {
    payload: import('jsonwebtoken').JwtPayload;
  }
}
