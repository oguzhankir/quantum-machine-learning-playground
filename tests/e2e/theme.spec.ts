import { test, expect, type Page } from '@playwright/test';

async function expectTheme(page: Page, theme: 'light' | 'dark') {
  await expect(page.locator('html')).toHaveCSS('color-scheme', theme);
  await expect(
    page.getByRole('button', {
      name: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
      exact: true,
    }),
  ).toBeVisible();
}

test('the theme follows the operating system before a personal choice is made', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./#why');
  await expectTheme(page, 'dark');

  await page.emulateMedia({ colorScheme: 'light' });
  await expectTheme(page, 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expectTheme(page, 'dark');
});

test('a keyboard-selected theme survives navigation and reload and takes precedence over the system', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./#why');
  const toggle = page.getByRole('button', {
    name: 'Switch to dark mode',
    exact: true,
  });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expectTheme(page, 'dark');
  await expect(
    page.getByRole('button', { name: 'Switch to light mode', exact: true }),
  ).toBeFocused();

  await page.getByRole('link', { name: /Back to the learning path/ }).click();
  await expect(page).toHaveURL(/#path$/);
  await expectTheme(page, 'dark');
  await page
    .getByRole('link', { name: /Explore your first experiment/ })
    .click();
  await expect(page).toHaveURL(/#waves$/);
  await expectTheme(page, 'dark');
  await page.reload();
  await expectTheme(page, 'dark');

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.emulateMedia({ colorScheme: 'light' });
  await expectTheme(page, 'dark');
  await page
    .getByRole('button', { name: 'Switch to light mode', exact: true })
    .click();
  await expectTheme(page, 'light');
  await page.reload();
  await expectTheme(page, 'light');
});

test('resetting lesson progress preserves the selected theme', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./#why');
  await page
    .getByRole('button', { name: 'Switch to dark mode', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Mark lesson complete', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: '✓ Completed', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');

  const menu = page.getByRole('button', {
    name: 'Open lesson menu',
    exact: true,
  });
  if (await menu.isVisible()) await menu.click();
  await page
    .getByRole('button', { name: 'Reset progress', exact: true })
    .click();
  await expect(page).toHaveURL(/#top$/);
  await expectTheme(page, 'dark');

  await page.goto('./#why');
  await expect(
    page.getByRole('button', { name: 'Mark lesson complete', exact: true }),
  ).toBeVisible();
  await expectTheme(page, 'dark');
});

test('the theme can still be changed when browser storage is unavailable', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem']) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value: () => {
          throw new DOMException('Storage is unavailable', 'SecurityError');
        },
      });
    }
  });
  await page.goto('./#why');
  await expectTheme(page, 'light');
  await page
    .getByRole('button', { name: 'Switch to dark mode', exact: true })
    .click();
  await expectTheme(page, 'dark');
  await page.getByRole('link', { name: /Back to the learning path/ }).click();
  await expect(page).toHaveURL(/#path$/);
  await expectTheme(page, 'dark');

  await page
    .getByRole('button', { name: 'Switch to light mode', exact: true })
    .click();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expectTheme(page, 'light');
  expect(errors).toEqual([]);
});
