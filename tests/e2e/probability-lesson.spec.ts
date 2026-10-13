import { expect, test } from '@playwright/test';

test('probability, complex-plane, and normalization diagrams connect exact quantities', async ({
  page,
}) => {
  await page.goto('./#math');
  const picture = page.getByTestId('probability-picture');
  await picture.getByRole('button', { name: '25% for 0' }).click();
  await expect(picture.getByRole('status')).toContainText('[0.25, 0.75]');
  await expect(
    picture.locator('.probability-squares .probability-zero'),
  ).toHaveCount(5);

  const arrow = page.getByTestId('complex-amplitude');
  await expect(arrow.getByRole('img')).toHaveAccessibleName(
    /real 0.300, imaginary 0.400/,
  );
  await arrow.getByRole('button', { name: '−0.5', exact: true }).click();
  await expect(arrow.locator('p[role="status"]')).toContainText(
    '(-0.500)² + (0.000)² = 0.25',
  );
  await arrow
    .getByRole('slider', { name: 'Amplitude arrow phase' })
    .fill('270');
  await expect(arrow.getByRole('img')).toHaveAccessibleName(
    /real 0.000, imaginary -0.500/,
  );
  await expect(arrow.getByTestId('complex-probability')).toHaveText('25%');

  const vector = page.getByTestId('vector-normalizer');
  await expect(vector.getByTestId('normalization-norm')).toHaveText('5.000');
  await vector.getByRole('button', { name: '[1 + i, 2]', exact: true }).click();
  await expect(vector.getByTestId('normalization-norm')).toHaveText('2.449');
  await expect(vector.getByTestId('normalized-probability-0')).toHaveText(
    'P(0) = 33.33%',
  );
  await expect(vector.getByTestId('normalized-probability-1')).toHaveText(
    'P(1) = 66.67%',
  );
});

test('relative phase is revealed by X while global phase preserves both lists', async ({
  page,
}) => {
  await page.goto('./#math');
  const preview = page.getByTestId('basis-preview');
  await preview.getByRole('button', { name: '180° relative phase' }).click();
  await expect(
    preview.getByRole('img', {
      name: 'X measurement: 0 percent for plus, 100 percent for minus.',
    }),
  ).toBeVisible();
  await expect(
    preview.getByRole('img', {
      name: 'Direct Z measurement: 50 percent for 0, 50 percent for 1.',
    }),
  ).toBeVisible();

  const lab = page.getByRole('region', {
    name: 'Amplitude and probability laboratory',
  });
  await lab.getByRole('tab', { name: 'Phase and measurement' }).click();
  await lab
    .getByRole('button', { name: 'Opposite · 180°', exact: true })
    .click();
  await expect(lab.getByRole('row', { name: '− 100.00%' })).toBeVisible();
  await expect(lab.getByRole('row', { name: '0 50.00%' })).toBeVisible();
  await lab
    .getByRole('slider', { name: 'Global phase of both amplitudes' })
    .fill('90');
  await expect(lab.getByRole('row', { name: '− 100.00%' })).toBeVisible();
  await expect(lab.getByRole('row', { name: '0 50.00%' })).toBeVisible();
  await lab
    .getByRole('slider', { name: 'Relative phase between amplitudes' })
    .fill('90');
  await expect(lab.getByRole('row', { name: '+ 50.00%' })).toBeVisible();
  await lab.getByRole('tab', { name: 'Phase and measurement' }).focus();
  await page.keyboard.press('Home');
  await expect(
    lab.getByRole('tab', { name: 'Magnitude → probability' }),
  ).toHaveAttribute('aria-selected', 'true');
  await lab.getByRole('button', { name: 'α = 0.5', exact: true }).click();
  const square = lab
    .getByTestId('amplitude-area-diagram')
    .getByRole('img', { name: /A square for outcome 0/ });
  await expect(square.locator('rect').nth(1)).toHaveAttribute('width', '50');
  await expect(square).toHaveAccessibleName(/area 25.00 percent/);
});

test('math and practice use focused dialogs without growing the article', async ({
  page,
}) => {
  await page.goto('./#math');
  const practice = page.getByTestId('practice-deck');
  await practice.scrollIntoViewIfNeeded();
  const articleHeight = await page
    .locator('#math')
    .evaluate((element) => element.getBoundingClientRect().height);
  await practice
    .getByRole('button', { name: 'Compare with the explanation', exact: false })
    .click();
  const answer = page.getByRole('dialog', {
    name: 'A probability list accounts for every outcome',
  });
  await expect(answer).toBeVisible();
  await expect(answer).toContainText('√0.75');
  expect(
    await page
      .locator('#math')
      .evaluate((element) => element.getBoundingClientRect().height),
  ).toBe(articleHeight);
  await page.keyboard.press('Escape');
  await expect(answer).not.toBeVisible();
  await practice.getByRole('button', { name: 'Next practice prompt' }).click();
  await expect(practice).toContainText('0.3 + 0.4i');
  await page
    .getByRole('button', { name: 'Explore the math', exact: false })
    .click();
  const math = page.getByRole('dialog', { name: 'Explore the math' });
  await expect(math).toBeVisible();
  await math.getByRole('button', { name: 'Next idea', exact: false }).click();
  await expect(math.locator('.katex')).toContainText('0.09+0.16');
  expect(
    await page
      .locator('#math')
      .evaluate((element) => element.getBoundingClientRect().height),
  ).toBe(articleHeight);
});

test('probability diagrams and both laboratory modes fit 320px in either theme', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  for (const theme of ['light', 'dark']) {
    await page.goto('./#math');
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    await expect(
      page.getByTestId('complex-amplitude').getByRole('img'),
    ).toBeVisible();
    const lab = page.getByRole('region', {
      name: 'Amplitude and probability laboratory',
    });
    for (const mode of ['Magnitude → probability', 'Phase and measurement']) {
      await lab.getByRole('tab', { name: mode, exact: true }).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    }
  }
});
