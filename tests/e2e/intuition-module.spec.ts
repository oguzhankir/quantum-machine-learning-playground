import { expect, test } from '@playwright/test';

test('completion has breathing room, persists, and can be undone without an assessment', async ({
  page,
}) => {
  for (const theme of ['light', 'dark']) {
    await page.addInitScript(
      (value) => localStorage.setItem('quantum-ml-playground:theme:v1', value),
      theme,
    );
    await page.goto('./#waves');
    const completion = page.getByRole('region', { name: 'Lesson completion' });
    await completion.scrollIntoViewIfNeeded();
    const card = await completion.boundingBox();
    const button = completion.getByRole('button', {
      name: 'Mark lesson complete',
      exact: true,
    });
    const action = await button.boundingBox();
    expect(action!.x - card!.x).toBeGreaterThanOrEqual(20);
    expect(
      card!.y + card!.height - action!.y - action!.height,
    ).toBeGreaterThanOrEqual(20);
    await button.click();
    await expect(completion).toContainText('Click to mark as incomplete.');
    await page.reload();
    const completed = completion.getByRole('button', {
      name: '✓ Completed',
      exact: true,
    });
    await expect(completed).toHaveAttribute('aria-pressed', 'true');
    await completed.click();
    await expect(button).toHaveAttribute('aria-pressed', 'false');
  }
});

test('every page has one feedback area and the repository link stays in the header', async ({
  page,
}) => {
  for (const route of [
    'why',
    'waves',
    'math',
    'intuition-code',
    'path',
    'glossary',
    'research',
  ]) {
    await page.goto(`./#${route}`);
    await expect(page.locator('#feedback')).toHaveCount(1);
    await expect(page.locator('#feedback')).toContainText('Send feedback');
    await expect(page.locator('footer a[href*="github.com"]')).toHaveCount(0);
    await expect(
      page.locator(
        '.site-header a[href="https://github.com/oguzhankir/quantum-machine-learning-playground"]',
      ),
    ).toHaveCount(1);
  }
});

test('the intuition module contains three connected lessons followed by its code notebooks', async ({
  page,
}) => {
  await page.goto('./#math');
  await expect(
    page
      .getByRole('navigation', { name: 'Lesson navigation', exact: true })
      .getByRole('link', { name: /Code notebooks/ }),
  ).toHaveAttribute('href', '#intuition-code');
  await page
    .getByRole('navigation', { name: 'Lesson navigation', exact: true })
    .getByRole('link', { name: /Code notebooks/ })
    .click();
  await expect(page).toHaveURL(/#intuition-code$/);
  await expect(page.locator('#page-heading')).toHaveText(
    'Build your intuition in code',
  );
  await expect(
    page.getByRole('region', { name: 'Lesson completion' }),
  ).toBeAttached();
  await expect(
    page
      .getByRole('navigation', { name: 'Lesson navigation', exact: true })
      .getByRole('link', { name: /States and superposition/ }),
  ).toHaveAttribute('href', '#states');
  const foundationsLinks = await page
    .locator('.nav-stage')
    .first()
    .locator('a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(foundationsLinks).toEqual([
    '#why',
    '#waves',
    '#math',
    '#intuition-code',
  ]);
});
