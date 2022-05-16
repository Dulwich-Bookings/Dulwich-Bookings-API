export default {
  sendGridAPI: process.env.SENDGRID_API_KEY as string,
  saltRounds: parseInt(process.env.SALT_ROUNDS as string) as number,
  jwtAccessTokenSecret: process.env.TOKEN_SECRET as string,
  jwtForgotPasswordTokenSecret: process.env.FORGET_PASSWORD_TOKEN as string,
};
