export interface JwtPayload {
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}
