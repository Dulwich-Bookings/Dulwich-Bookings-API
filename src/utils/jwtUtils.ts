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

  static verifyAccessToken(accessToken: string) {
    return jwt.verify(accessToken, enviroment.jwtAccessTokenSecret);
  }

  static verifySetPasswordAccessToken(accessToken: string, secret: string) {
    return jwt.verify(accessToken, secret);
  }

  static getPayload(accessToken: string) {
    return jwt.decode(accessToken) as Payload;
  }
}

export default JWTUtils;
