import { test, expect } from '@playwright/test';
import { initialProgress, STORAGE_KEY } from '../../src/lib/learning/progress';

test('the introduction explains one observation, invites a guess, and continues into an experiment', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(
    ({ key, progress }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(progress));
    },
    {
      key: STORAGE_KEY,
      progress: {
        ...initialProgress(),
        answers: { 'why-check': { first: 1, selected: 1, revealed: true } },
      },
    },
  );
  await page.goto('./#why');
  await expect(page.locator('#page-heading')).toHaveText(
    'Why learn quantum mechanics?',
  );
  const intro = page.locator('#why');
  await expect(
    intro.getByRole('link', { name: 'Try the light experiment →' }),
  ).toHaveCount(0);
  await expect(
    intro.getByRole('img', { name: /Four prominent visible hydrogen/ }),
  ).toBeVisible();
  await expect(
    page.locator('.math-panel, .lesson-depth, .concept-card, .lesson-context'),
  ).toHaveCount(0);
  await expect(
    intro.getByRole('heading', {
      name: 'Understand the light and materials around you.',
    }),
  ).toBeVisible();
  await expect(page.locator('.lesson-assessment input:checked')).toHaveCount(0);
  await expect(
    page.locator('.lesson-assessment .assessment-explanation'),
  ).toHaveCount(0);
  await intro
    .getByRole('button', {
      name: 'No, an extra route should make it brighter.',
      exact: true,
    })
    .click();
  await expect(intro.getByRole('status')).toContainText(
    'A natural starting guess.',
  );
  await intro
    .getByRole('button', {
      name: 'Maybe. Could the two routes cancel?',
      exact: true,
    })
    .click();
  await expect(intro.getByRole('status')).toContainText('That can happen.');
  await expect(
    intro.getByRole('button', {
      name: 'Maybe. Could the two routes cancel?',
      exact: true,
    }),
  ).toHaveAttribute('aria-pressed', 'true');
  const assessment = page.locator('.lesson-assessment');
  await assessment
    .getByRole('button', { name: 'Start the quiz', exact: true })
    .click();
  const check = page.getByRole('dialog', {
    name: 'Check your understanding',
    exact: true,
  });
  await check
    .getByRole('radio', {
      name: 'Its electrons can make specific allowed energy changes.',
    })
    .check();
  await check
    .getByRole('button', { name: 'Check answer', exact: true })
    .click();
  await expect(check.locator('.assessment-explanation')).toContainText(
    'An atom has allowed energy levels',
  );
  await check.getByRole('button', { name: 'Pause quiz', exact: true }).click();
  await page
    .getByRole('button', { name: 'Mark lesson complete', exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: '✓ Completed', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await assessment
    .getByRole('button', { name: 'Resume quiz', exact: true })
    .click();
  await expect(check.locator('.assessment-your-answer')).toContainText(
    'Its electrons can make specific allowed energy changes.',
  );
  await check.getByRole('button', { name: 'Pause quiz', exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Lesson navigation' })
    .locator('a[href="#waves"]')
    .click();
  await expect(page).toHaveURL(/#waves$/);
  await expect(page.locator('.experiment')).toBeVisible();
  expect(errors).toEqual([]);
});

test('the repository link stays available without overflowing small screens', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./#why');
    const repository = page.locator('.site-header').getByRole('link', {
      name: 'Quantum ML Playground on GitHub (opens in a new tab)',
      exact: true,
    });
    await expect(repository).toBeVisible();
    await expect(repository).toHaveAttribute(
      'href',
      'https://github.com/oguzhankir/quantum-machine-learning-playground',
    );
    await expect(repository).toHaveAttribute('target', '_blank');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const bounds = await repository.boundingBox();
    expect(bounds?.x).toBeGreaterThanOrEqual(0);
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(width);
  }
});
