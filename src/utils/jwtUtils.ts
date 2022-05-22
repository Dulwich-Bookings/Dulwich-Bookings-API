import jwt, {SignOptions} from 'jsonwebtoken';
import enviroment from '../consts/enviroment';

class JWTUtils {
  static generateAccessToken(payload: string, options: SignOptions = {}) {
    options.expiresIn = '1d';
    return jwt.sign(payload, enviroment.jwtAccessTokenSecret, options);
  }

  static verifyAccessToken(accessToken: string) {
    return jwt.verify(accessToken, enviroment.jwtAccessTokenSecret);
  }
}

export default JWTUtils;
