import { expect, test } from '@playwright/test';
import { PbaManagementPage } from '../../page-objects/pba-management.po';

test('PBA row matches an exact account number when another number has the same prefix', async ({ page }) => {
  await page.setContent(`
    <table><tbody>
      <tr><th scope="row">PBA123456</th><td><a href="#">Remove</a></td></tr>
      <tr><th scope="row">PBA1234567</th><td><a href="#">Remove</a></td></tr>
    </tbody></table>
  `);

  const pbaManagementPage = new PbaManagementPage(page);
  await expect(pbaManagementPage.pbaRow('PBA123456')).toHaveCount(1);
  await expect(pbaManagementPage.pbaRow('PBA123456')).toContainText('PBA123456');
});
