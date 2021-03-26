import * as puppeteer from 'puppeteer';
import {Error} from 'tslint/lib/error';

const username = process.env.TEST_API_EMAIL;
const password = process.env.TEST_API_PASSWORD;
let xsrfCookie = '';
let xxsrfCookie = '';

const userNameCSSSelector = '#username';
const passwordCSSSelector = '#password';

let userCookie = '';

export async function  authenticateAndGetcookies(url)  {
  console.log( 'Getting Cookie details...');
  if (userCookie !== '')
  {
    return userCookie;
  }
  const browser = await puppeteer.launch(getPuppeteerLaunchOptions(url));

  const page = await browser.newPage();
  await page.goto(url);
  console.log( 'Loading...');

  // try {
  //   await page.waitForSelector('#username', { visible: true });
  //
  //   await page.type('#username', username);
  //   await page.type('#password', password);
  //
  //   await page.click('.button');
  //   await page.waitForSelector('.hmcts-primary-navigation', { visible: true });
  // } catch (error) {
  //   await browser.close();
  //   throw error;
  // }
  let loginRetryCounter = 0;
  let isLoginSuccess = false;
  while (loginRetryCounter < 3 && !isLoginSuccess) {
    try {
      console.log(`login retry attempt : ' + ${loginRetryCounter}`);
      await page.waitForSelector(userNameCSSSelector, { visible: true, timeout: 20000 });
      await page.type(userNameCSSSelector, username);
      await page.type(passwordCSSSelector, password);
      await page.click('.button');
      // browser.sleep(10000);
      await page.waitForSelector('.hmcts-header__navigation', { visible: true, timeout: 30000 });
      isLoginSuccess = true;
    } catch (error) {
      const usernameInput = await page.$eval(userNameCSSSelector , element => element.value);
      if (usernameInput === '') {
        loginRetryCounter++;
        console.log(`Login error :  ${error.message}`);
      } else {
        await browser.close();
        throw error;
      }
    }
  }
  if (!isLoginSuccess) {
    throw new Error('Login not successful...');
  }
  const cookies: [] = await page.cookies();
  // let xsrfCookie = '';
  let authCookie = '';
  let webappCookie = '';

  cookies.forEach((cookie: any) => {
    if (cookie.name === 'XSRF-TOKEN') {
       xxsrfCookie = cookie.value;
       xsrfCookie = `XSRF-TOKEN= ${cookie.value}`;
    }
    if (cookie.name === '__auth__') {
      authCookie = `__auth__= ${cookie.value}`;
    }
    if (cookie.name === 'xui-mo-webapp') {
      webappCookie = `xui-mo-webapp= ${cookie.value}`;
    }
  });
  const finalCookie = `${webappCookie};${authCookie};${xsrfCookie}`;

  await browser.close();
  userCookie = finalCookie;
  return finalCookie;
}

export async function xxsrftoken()  {
  return xxsrfCookie;
}

function getPuppeteerLaunchOptions(url) {
  const puppeteerOption = { ignoreHTTPSErrors: true, headless: true, args: [] };
  // if (!url.includes('manage-org.')) {
  //   puppeteerOption.args.push('--proxy-server=http://proxyout.reform.hmcts.net:8080');
  // }

  return puppeteerOption;
}
