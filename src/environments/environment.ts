// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    // remove this line if GA is need only for production. For time being, to test on aat env, added this.
    googleAnalyticsKey: 'UA-124734893-1',
    serviceDeskEmail: 'DCD-ITServiceDesk@hmcts.net',
    serviceDeskTel: '0300 3030686'
};
