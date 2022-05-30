import jwt, {SignOptions} from 'jsonwebtoken';
import enviroment from '../consts/enviroment';
import {Payload} from '../models/User';

class JWTUtils {
  static generateAccessToken(payload: Payload) {
    const options: SignOptions = {expiresIn: '180 days'};
    return jwt.sign(payload, enviroment.jwtAccessTokenSecret, options);
  }

  static generateSetPasswordAccessToken(
    payload: Payload,
    secret: string,
    options = {}
  ) {
    return jwt.sign(payload, secret, options);
  }

  static verifyAccessToken(
    accessToken: string,
    token = enviroment.jwtAccessTokenSecret
  ) {
    return jwt.verify(accessToken, token);
  }

  static getPayload(accessToken: string) {
    return jwt.decode(accessToken) as Payload;
  }
}

export default JWTUtils;
