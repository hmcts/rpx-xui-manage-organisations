// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  googleAnalyticsKey: 'UA-124734893-4',
  serviceDeskEmail: 'DCD-ITServiceDesk@hmcts.net',
  serviceDeskTel: '0300 3030686',
  cookies: {
    token: '__auth__',
    userId: '__userid__'
  },
  urls: {
    idam: {
      idamApiUrl: 'https://idam-api.platform.hmcts.net',
      idamClientID: 'xuimowebapp',
      idamLoginUrl: 'https://hmcts-access.service.gov.uk',
      indexUrl: '/',
      oauthCallbackUrl: 'oauth2/callback'
    }
  }
};
