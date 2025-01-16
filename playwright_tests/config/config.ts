export const config = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3000/',
  base: {
    username: process.env.TEST_USER1_EMAIL,
    password: process.env.TEST_USER1_PASSWORD
  },
  roo: {
    username: process.env.TEST_ROO_EMAIL,
    password: process.env.TEST_ROO_PASSWORD
  },
  twoFactorAuthEnabled: false,
  termsAndConditionsEnabled: true
};
