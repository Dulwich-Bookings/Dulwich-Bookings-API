import jwt, {SignOptions} from 'jsonwebtoken';
import enviroment from '../consts/enviroment';
import {Payload} from '../models/User';

class JWTUtils {
  static generateAccessToken(
    payload: Payload,
    secret: string = enviroment.jwtAccessTokenSecret,
    options: SignOptions = {expiresIn: '180 days'}
  ) {
    return jwt.sign(payload, secret, options);
  }

  static verifyAccessToken(
    accessToken: string,
    secret: string = enviroment.jwtAccessTokenSecret
  ) {
    return jwt.verify(accessToken, secret);
  }

  static getPayload(accessToken: string) {
    return jwt.decode(accessToken);
  }
}

export default JWTUtils;
