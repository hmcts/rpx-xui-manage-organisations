# rpx-xui-manage-organisations

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## VPN make sure is running

## Node Proxy Server  
Run `npm run start:node`

## Issues and Solutions

Property 'cookies' does not exist on type 'EnhancedRequest' - you will need to make
sure @types/express-session is added ie.
`yarn add @types/express-session`

## Frontend 
Run `npm run start:ng` for a dev server in separate terminal. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Integration Documentation

https://tools.hmcts.net/confluence/display/EUI/EXUI+Low+Level+Design

## Running Consumer Driven Contract tests (pact)

Run `yarn test-pact` to execute the Pact tests 
For publishing the pacts to broker execute `yarn publish-pact`

## Further help 1

To get more help on the Angular CLI use `ng help` or go and check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Logger errors and warnings

Extended version of script below:

(https://robferguson.org/blog/2017/09/09/a-simple-logging-service-for-angular-4/)


# Branches, Enviroment and Deployment methods used

```javascript
 |---------------------------------------|
 | Branch | Environment | Deployment via |
 |---------------------------------------|
 | local  | development | -              |
 | PR     | preview     | Jenkins        |
 | Master | aat         | Jenkins        |
 | Master | aat         | Flux           |
 | Master | ithc        | Flux           |
 | Master | production  | Flux           |
 |---------------------------------------|
```

# Path to configuration

The application should point to the configuration folder that contains the .json configuration files. There 
should only ever be two files within this folder:

custom-environmental-variables.json <- Allows configuration values to be set by the machines environmental values.
Through the Jenkins pipelines they are overwritten by values.*.template.yaml files for the Preview and AAT enviroments.
On AKS they are only overwritten by values.yaml
default.json <- Should contain Production configuration values.

Adding new files into /config should be avoided, as it increases complexity. Local needs to be setup to point 
at AAT, but this should be done by the developer on their local machine. 

It increases complexity if we were to add files to /config as we already have the Preview and AAT Jenkins enviromental values contained within values.preview.template.yaml and values.aat.template.yaml.

We should only have a default.json file within /config that has all the Production configuration values.

# Environment

`NODE_ENV_CONFIG=local` will turn on tunneling on a local environment.

# Setting up Secrets locally (Required)

You need to setup secrets locally before you run the project. Why? - When you push this application
up through AKS deployed through Flux to AAT, ITHC and Prod, the application will take in the secrets on these environments.

The developer needs to set these up locally, so that the developer can see any issues early in
the development process, and not when the application is placed up onto the higher AKS environments.

To setup the secrets locally do the following:

Note that Mac OS Catalina introduced a new feature that overlaps and reinforces the filesystem,
therefore you will not be able to make changes in the root directory of your file system, hence there are different
ways to setup secrets, Pre Catalina and Post Catalina, note that the Post Catalina way should work 
for all operating system, but I have yet to try this.

####MAC OS - Pre Catalina

1. Create a Mount point on your local machine<br/>
Create the folder: `/mnt/secrets/rpx`
2. In this folder we create a file per secret.
ie.
We create the file postgresql-admin-pw (no extension).
Within the file we have one line of characters which is the secret.

####MAC OS - Post Catalina

1. Create a Mount point on your local machine within the Volumes folder<br/>
Create the folder: `/Volumes/mnt/secrets/rpx`
2. In this folder we create a file per secret.
ie.
We create the file postgresql-admin-pw (no extension).
Within the file we have one line of characters which is the secret.
3. If you want to test the secrets locally override the default mountPoint with the following additional option added to .addTo
ie. 
`propertiesVolume.addTo(secretsConfig, { mountPoint: '/Volumes/mnt/secrets/' });`

Note that this is connected into the application via the following pieces of code:
```javascript
  keyVaults:
    rpx:
      secrets:
        - postgresql-admin-pw
        - appinsights-instrumentationkey-tc
```

which in turn uses `propertiesVolume.addTo()`

# How Application Configuration (Node Config) Works

The application picks up the configuration from the /config .json files.

The references within *.json ie. production.json are set by the /charts/xui-terms-and-conditions/values.yaml file ie.
POSTGRES_SERVER_PORT is set by POSTGRES_SERVER_PORT within values.yaml. <br><br>HOWEVER if there is a
values.*.template.yaml file it will override the values within the values.yaml file, BUT this only happens on the JENKINS
pipelines, where values.*.template.yaml are available to the build pipeline.

AKS uses a .json file in /config and the values.yaml from within charts/xui-terms-and-conditions ONLY.
 
AKS does not use values.aat.template.yaml and values.previews.template.yaml

DO NOT create a new .json file within /config as this increases the complexity of configuration. 

Node config selects the file within /config based on `NODE_ENV` which is always production on all environments,
due to Reform standards, this should not change on different environments, it should always be `NODE_ENV=production`

Note that I'm currently leveraging `NODE_CONFIG_ENV` which passes in the environment as we have a database password on
the preview environment that cannot be stored within any of our configuration files, as this is an open repo,
and the same password is being used on AAT.

In other projects we will not need to leverage `NODE_CONFIG_ENV`.

Note about secrets ie. 

```javascript
  keyVaults:
    rpx:
      secrets:
        - postgresql-admin-pw
        - appinsights-instrumentationkey-tc
 ```   
are set within the values.yaml and there should be NO REFERENCE to them within any /config/*.json file.

The application pulls out the secrets directly using `propertiesVolume.addTo()`

# Session Timeout

The applications Session Timeouts are set via configuration and can be overridden, please @see default.json
and @see .env.defaults.

Example configuration:
```javascript
SESSION_TIMEOUTS=[{"idleModalDisplayTime": 6, "pattern":"pui-", "totalIdleTime": 55},{"idleModalDisplayTime": 3, "pattern":"caseworker-", "totalIdleTime": 30}, {"idleModalDisplayTime": 6, "pattern":".", "totalIdleTime": 60}]
 ```
 
Note that the wildcard Reg Ex '.' pattern seen in the following sets the applications default.
```javascript
{"idleModalDisplayTime": 6, "pattern":".", "totalIdleTime": 60
```

Each Session Timeout object accepts a Reg Ex pattern, which sets the Session Timeout for that User group.

Jargon used:

Session Timeout Modal - The modal popup that appears BEFORE the users Total Idle Time is over.

Total Idle Time - The Users total idle time, this includes time in which we show the Session Timeout Modal to the User.

Idle Modal Display Time - The time we display the Session Timeout Modal for.

Session Timeout Configuration - An array that contains the Applications and User Groups session timeout times.

Session Timeout - An object that contains the Idle Modal Display Time, Reg Ex pattern so that we use
the correct Session Timeout for the application / and or User Groups and Total Idle Time.  

END2
