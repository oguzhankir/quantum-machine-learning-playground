import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('waves sections lead to separate reading, laboratory, practice, and self-check areas', async ({
  page,
}, testInfo) => {
  await page.goto('./#waves');
  const navigator = page.getByRole('navigation', { name: 'Lesson sections' });
  const reading = page.locator('#waves-idea');
  const laboratory = page.locator('#waves-lab');
  const lab = page.getByRole('region', {
    name: 'Wave and interference laboratory',
  });
  const initialScroll = await page.evaluate(() => window.scrollY);
  await navigator.getByRole('button', { name: /Experiment/ }).click();
  await expect(laboratory).toBeInViewport();
  await expect(
    reading.getByRole('heading', { name: 'Two contributions. One result.' }),
  ).not.toBeInViewport();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(
    initialScroll + 500,
  );
  await expect(
    navigator.getByRole('button', { name: /Experiment/ }),
  ).toHaveAttribute('aria-current', 'step');
  if (testInfo.project.name === 'desktop') {
    const readingBox = await reading.boundingBox();
    const labBox = await lab.boundingBox();
    expect(labBox!.width).toBeGreaterThan(readingBox!.width + 100);
  }
  await navigator.getByRole('button', { name: /Practice/ }).click();
  await expect(page.locator('#waves-practice')).toBeInViewport();
  await expect(page.locator('#waves-practice .practice-deck')).toHaveCount(1);
  await expect(page.locator('.practice-deck-topline')).toContainText('1 / 4');
  await navigator.getByRole('button', { name: /Self-check/ }).click();
  await expect(page.locator('#waves-check')).toBeInViewport();
  await expect(navigator).toBeInViewport();
  await navigator.getByRole('button', { name: /Understand/ }).click();
  await expect(reading).toBeInViewport();
  await expect(laboratory).not.toBeInViewport();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
});

test('classical phase comparison makes reinforcement and cancellation visible', async ({
  page,
}) => {
  await page.goto('./#waves');
  const controls = page.getByRole('group', { name: 'Compare wave phases' });
  const explanation = page.locator('.wave-phase-explanation');
  await controls.getByRole('button', { name: 'Half cycle · 180°' }).click();
  await expect(explanation).toContainText('+1 and −1 give 0');
  await expect(
    page.getByRole('img', {
      name: /A \+ B at each position at phase 180 degrees; displacement at the marked position is 0/,
    }),
  ).toBeVisible();
  await controls.getByRole('button', { name: 'Quarter cycle · 90°' }).click();
  await expect(explanation).toContainText('+1 and 0 give +1');
  await controls.getByRole('button', { name: 'Full cycle · 360°' }).click();
  await expect(explanation).toContainText('+1 and +1 give +2');
});

test('screen detections follow the selected experiment and never accumulate across changed settings', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./#waves');
  const lab = page.getByRole('region', {
    name: 'Wave and interference laboratory',
  });
  const total = page.getByTestId('waves-detection-total');
  const binOne = page.getByTestId('waves-bin-one');
  await lab.getByRole('button', { name: 'Opposite phase · 180°' }).click();
  await expect(binOne).toHaveText('0.00%');
  await lab
    .getByRole('button', { name: 'Collect 1 detection', exact: true })
    .click();
  await expect(total).toHaveText('1');
  await expect(page.getByTestId('waves-detection-histogram')).toBeVisible();
  await expect(lab.locator('.waves-detection-bar[data-count="1"]')).toHaveCount(
    1,
  );
  await expect(lab.locator('.waves-detection-bar[data-count="0"]')).toHaveCount(
    15,
  );
  await lab.getByRole('button', { name: 'Collect 100 detections' }).click();
  await expect(total).toHaveText('101');
  await lab
    .getByText('Inspect amplitudes and probabilities for all 16 bins')
    .click();
  const table = page.getByRole('dialog', { name: 'All 16 screen bins' });
  const rows = table.locator('tbody tr');
  await expect(rows.first().locator('td').last()).toHaveText('0');
  const counts = await rows.locator('td:last-child').allTextContents();
  expect(counts.reduce((sum, count) => sum + Number(count), 0)).toBe(101);
  await table.getByRole('button', { name: 'Close', exact: true }).click();
  await lab.getByRole('button', { name: 'Opposite phase · 180°' }).click();
  await expect(total).toHaveText('101');
  await lab
    .getByRole('checkbox', { name: /Record which-path information/ })
    .check();
  await expect(total).toHaveText('0');
  await expect(binOne).toHaveText('6.25%');
  await lab.getByRole('button', { name: 'Collect 100 detections' }).click();
  await expect(total).toHaveText('100');
  await lab
    .getByRole('slider', { name: 'Relative phase between paths φ' })
    .fill('90');
  await expect(total).toHaveText('0');
  await expect(binOne).toHaveText('6.25%');
  await lab
    .getByRole('button', { name: 'Collect 1 detection', exact: true })
    .click();
  await lab.getByRole('button', { name: 'Clear detections' }).click();
  await expect(total).toHaveText('0');
  await lab.getByRole('button', { name: 'Reset interference' }).click();
  await expect(binOne).toHaveText('12.50%');
  await expect(lab.getByRole('slider')).toHaveValue('0');
  await expect(lab.getByRole('checkbox')).not.toBeChecked();
  expect(errors).toEqual([]);
});
