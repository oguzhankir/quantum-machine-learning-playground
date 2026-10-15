import { test, expect } from '@playwright/test';

test('desktop workspaces retain reading context beside the selected content', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop companion columns');
  for (const { route, content, companion } of [
    {
      route: 'noise',
      content: '#noise-lab',
      companion: '.reading',
    },
    {
      route: 'history?track=physics&event=physics-shor',
      content: '[data-testid="milestone-detail"]',
      companion: '.history-rail',
    },
    {
      route: 'research?direction=ml-for-quantum-science',
      content: '[data-testid="research-detail"]',
      companion: '.research-explorer',
    },
  ]) {
    await page.goto(`./#${route}`);
    await page.locator(content).waitFor();
    await page.locator(content).evaluate((element) => {
      window.scrollTo({
        top: window.scrollY + element.getBoundingClientRect().top + 350,
        behavior: 'instant',
      });
    });
    await expect(page.locator(companion)).toBeInViewport({ ratio: 0.8 });
    const bounds = await page.locator(companion).boundingBox();
    expect(bounds?.y).toBeGreaterThanOrEqual(76);
    expect((bounds?.y ?? 0) + (bounds?.height ?? 0)).toBeLessThanOrEqual(1001);
    if (route.startsWith('research'))
      await expect(
        page.locator('.research-map-grid a[aria-current="true"]'),
      ).toBeInViewport();
  }
});

test('glossary search remains available while browsing a long list', async ({
  page,
}) => {
  await page.goto('./#glossary');
  await expect(page.locator('.glossary-section dt').first()).toBeVisible();
  const initialCount = await page.locator('.glossary-section dt').count();
  const search = page.getByRole('searchbox', { name: 'Search glossary' });
  await page.evaluate(() =>
    window.scrollTo({ top: 1200, behavior: 'instant' }),
  );
  await expect(search).toBeInViewport();
  await search.fill('amplitude');
  await expect(page.locator('.glossary-section dt').first()).toBeVisible();
  expect(await page.locator('.glossary-section dt').count()).toBeLessThan(
    initialCount,
  );
  await page.getByRole('button', { name: 'Clear glossary search' }).click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.glossary-section dt')).toHaveCount(initialCount);
});

test('mobile navigation contains keyboard focus and closes with Escape', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile navigation drawer');
  await page.goto('./#gates');
  const opener = page.getByRole('button', {
    name: 'Open lesson menu',
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Learning path' });
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole('button', { name: 'Reset progress', exact: true })
    .focus();
  await page.keyboard.press('Tab');
  await expect(
    dialog.getByRole('button', { name: 'Close navigation' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
});
