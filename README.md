# RpaPuiManage

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

Therefore it requires you to install Angular CLI:
`npm install -g @angular/cli`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Setup notes

To build you need to run `npm run build` which will run the ng build first and then the
node build.

Then your /dist folder will be populated with both the /api folder for the node backend and the ng assets for the frontend, within it.

#Issues

If you get the following issues, try the resolution underneath.

Issue: Module build failed: Error: ENOENT: no such file or directory, scandir '/Users/philip/Projects/prd-pui-manager/node_modules/node-sass/vendor'
Resolution: try `npm rebuild node-sass`


#Configure
Please add the S2S_SECRET and IDAM SECRET to you enviorment.
If you are using MAC please use the following command before you start api
`export S2S_SECRET=KY4XS6KBPBSVOOSQ; export IDAM_SECRET=TZdHXaDbvZTfNy6U;`
Please use this command for Windows:
`SET S2S_SECRET=KY4XS6KBPBSVOOSQ; SET IDAM_SECRET=TZdHXaDbvZTfNy6U;`
