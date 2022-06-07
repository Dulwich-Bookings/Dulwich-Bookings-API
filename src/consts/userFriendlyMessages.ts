export default {
  success: {
    getOneTag: 'Successfully retrieved Tag.',
    getAllTags: 'Successfully retrieved Tags.',
    createTag: 'Successfully created Tag.',
    updateTag: 'Successfully updated Tag.',
    deleteTag: 'Successfully deleted Tag.',

    getOneUser: 'Successfully retrieved User.',
    getAllUsers: 'Successfully retrieved Users.',
    createUser:
      "Successfully created User(s). Please check your email's inbox (and junk folder) for a confirmation link before signing in.",
    updateUser: 'Successfully updated User.',
    deleteUser: 'Successfully deleted User(s).',

    sendEmail: 'Successfully sent email.',

    confirmEmail: 'Successfully confirmed email.',
    signIn: 'Successfully signed in.',
    setPassword: 'Successfully set password',
    resetPassword: 'Successfully reset password.',
    sendForgetPasswordEmail:
      "Successfully sent email. Please check your email's inbox (and junk folder) for a set password link.<br>" +
      'Please note that the link will be valid for 30 minutes.',

    createResource: 'Successfully created resource.',
    getAllResources: 'Successfully retrieved resources.',
    getOneResource: 'Successfully retrieved resource.',
    updateResource: 'Successfully updated resource.',
    deleteResource: 'Successfully deleted resource.',
  },
  failure: {
    getOneTag: 'Error in retrieved Tag.',
    getAllTags: 'Error in retrieved Tags.',
    createTag: 'Error in created Tag.',
    updateTag: 'Error in updated Tag.',
    deleteTag: 'Error in deleted Tag.',

    getOneUser: 'Error in retrieving User.',
    getAllUsers: 'Error in retrieving Users.',
    createUser: 'Error in creating User(s).',
    updateUser: 'Error in updating User.',
    deleteUser: 'Error in deleting User(s).',

    sendEmail: 'Error in sending email.',

    userNotExist: 'User does not exist.',

    emailExists: 'Email already exists.',
    noAuthToken: 'Authorization token not found',
    malformedToken: 'Malformed token',
    invalidToken: 'Invalid authentication token',
    confirmEmail: 'Error in confirming email.',
    emailNotExist: 'Email does not exist.',
    passwordConfirmationMismatch:
      'Password and password confirmation does not match.',
    signIn: 'Error in signing in.',
    userIsTemporary:
      "User password is temporary. Please check your email's inbox  (and junk folder) to set password.",
    incorrectPassword: 'Password is incorrect.',
    emailNotConfirmed:
      "Email is not confirmed. Please check your email's inbox (and junk folder) for a confirmation link.",
    setPassword: 'Erorr in setting password',
    resetPassword: 'Error in resetting password.',
    fileNotFound: 'File is not found.',
    parseCsv: 'Error in parsing CSV file.',
    signUpAttributes: 'Error in getting sign up attributes.',

    invalidClass: 'Class must be a valid year.',
    invalidPassword:
      'Password must at least be 6 characters long with at least 1 special character (@ $ ! % * # ? &).',

    createResource: 'Error in creating resource.',
    getAllResources: 'Error in retrieving resources.',
    getOneResource: 'Error in retrieving resource.',
    updateResource: 'Error in updating resource.',
    deleteResource: 'Error in deleting resource.',
  },
};
