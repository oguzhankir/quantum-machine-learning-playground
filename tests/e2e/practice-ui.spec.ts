import { expect, test } from '@playwright/test';

test('practice stays one prompt at a time and explanations preserve the reading position', async ({
  page,
}) => {
  await page.goto('./#waves');
  const deck = page.getByTestId('practice-deck');
  await expect(deck.locator('.practice-deck-prompt h3')).toHaveText(
    'A wave is a moving pattern',
  );
  await deck
    .getByRole('textbox', { name: /Your reasoning/ })
    .fill('The travelling pattern and the cork have different motions.');
  const launch = deck.getByRole('button', {
    name: 'Compare with the explanation',
  });
  await launch.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    scroll: window.scrollY,
  }));
  await launch.click();
  const answer = page.getByRole('dialog', {
    name: 'A wave is a moving pattern',
    exact: true,
  });
  await expect(answer).toBeVisible();
  await expect(answer).toContainText(
    'The travelling pattern and the cork have different motions.',
  );
  await expect(answer).toContainText('Connect the steps');
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(
    before.height,
  );
  await page.keyboard.press('Escape');
  await expect(answer).not.toBeVisible();
  await expect(launch).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(before.scroll);
  await deck.getByRole('button', { name: 'Next practice prompt' }).click();
  await expect(deck.locator('.practice-deck-prompt h3')).toHaveText(
    'Phase tells us how waves line up',
  );
  await expect(deck.locator('.practice-deck-prompt')).toHaveCount(1);
  await expect(deck.getByRole('textbox')).toHaveValue('');
  await deck.getByRole('button', { name: 'Previous practice prompt' }).click();
  await expect(deck.getByRole('textbox')).toHaveValue(
    'The travelling pattern and the cork have different motions.',
  );
});

test('math presents one connection at a time without expanding the lesson', async ({
  page,
}) => {
  await page.goto('./#waves');
  const launch = page.getByRole('button', {
    name: 'Explore the math',
    exact: false,
  });
  await launch.scrollIntoViewIfNeeded();
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  await launch.click();
  const math = page.getByRole('dialog', {
    name: 'Explore the math',
    exact: true,
  });
  await expect(math).toBeVisible();
  await expect(math.locator('.math-step-content')).toHaveCount(1);
  await expect(math.locator('.math-step-content .formula')).toHaveCount(1);
  await expect(math.locator('.math-step-position')).toHaveText(/^1 \/ \d+$/);
  await math.getByRole('button', { name: 'Next idea' }).click();
  await expect(math.locator('.math-step-position')).toHaveText(/^2 \/ \d+$/);
  await expect(math.locator('.math-step-content .formula')).toHaveCount(1);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(
    height,
  );
  await page.keyboard.press('Escape');
  await expect(launch).toBeFocused();
});

test('first lessons use source dialogs instead of expanding inline lists', async ({
  page,
}) => {
  for (const lesson of ['why', 'waves']) {
    await page.goto(`./#${lesson}`);
    await expect(
      page.locator(
        '.intro-content details, .wave-lesson-content details, .waves-lab details',
      ),
    ).toHaveCount(0);
    const references = page.locator('.lesson-references').getByRole('button');
    await references.click();
    const dialog = page.getByRole('dialog', {
      name:
        lesson === 'why'
          ? 'Sources, if you want to look closer'
          : 'References and further reading',
    });
    await expect(dialog).toBeVisible();
    const sources = dialog.locator('.lesson-references-list a');
    expect(await sources.count()).toBeGreaterThan(0);
    for (const source of await sources.all()) {
      await expect(source).toHaveAttribute('target', '_blank');
      expect(new URL((await source.getAttribute('href'))!).protocol).toBe(
        'https:',
      );
    }
    await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(references).toBeFocused();
  }
});

test('supplementary dialogs fit narrow screens in both reading themes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 620 });
  await page.goto('./#waves');
  for (const theme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: theme });
    const launchers = [
      page.getByRole('button', { name: 'Compare with the explanation' }),
      page.getByRole('button', { name: 'Explore the math', exact: false }),
      page.locator('.lesson-references').getByRole('button'),
      page.getByRole('button', {
        name: /Inspect amplitudes and probabilities/,
      }),
    ];
    for (const launcher of launchers) {
      await launcher.click();
      const dialog = page.locator('.focus-dialog[open]');
      await expect(dialog).toHaveCount(1);
      const box = await dialog.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
      expect(box!.y + box!.height).toBeLessThanOrEqual(620);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
      await expect(
        dialog.getByRole('button', { name: 'Close', exact: true }),
      ).toBeInViewport();
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    }
  }
});
