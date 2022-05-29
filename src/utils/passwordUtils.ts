class passwordUtils {
  static generateRandomPassword() {
    let password = '';
    const str =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    const len = str.length;
    for (let i = 0; i < 8; i++) {
      password += str.charAt(Math.floor(len * Math.random()));
    }
    return password;
  }
}

export default passwordUtils;
