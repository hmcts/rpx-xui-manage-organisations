import { config } from '../config/config';

export async function navigateToUrl(page: any, url: string) {
  const navigationUrl = config.baseUrl + url;
  await page.goto(navigationUrl);
  console.log('navigated to ' + navigationUrl);
}
