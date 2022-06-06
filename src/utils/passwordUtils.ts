class passwordUtils {
  // create a random password of length 10 with at least 1 special character
  static generateRandomPassword() {
    let password = '';
    const specialCharacterStr = '@$!%*#?&';
    const allCharacterStr =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*#?&';

    const specialStrLen = specialCharacterStr.length;
    password += specialCharacterStr.charAt(
      Math.floor(specialStrLen * Math.random())
    );

    const allStrLen = allCharacterStr.length;
    for (let i = 0; i < 9; i++) {
      password += allCharacterStr.charAt(Math.floor(allStrLen * Math.random()));
    }
    return password;
  }
}

export default passwordUtils;
