import { test as base, expect } from '@playwright/test';
const test = base.extend<{ runtimeErrors: string[] }>({
  runtimeErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await use(errors);
      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
});
test.beforeEach(async ({ page }) => {
  await page.goto('./');
});
test('starts, navigates, and loads a production deep link with bundled assets', async ({
  page,
}) => {
  await page.getByRole('link', { name: 'Start learning' }).click();
  await expect(page).toHaveURL(/#why$/);
  await page
    .getByRole('navigation', { name: 'Chapters' })
    .getByRole('link', { name: /States & amplitudes/ })
    .click();
  await expect(page).toHaveURL(/#states$/);
  await page.goto('./#learning');
  await expect(
    page.getByRole('heading', {
      name: 'The bridge to quantum machine learning',
    }),
  ).toBeVisible();
  await expect(page.getByTestId('loss')).toHaveText('0.5000000000');
  const assets = await page
    .locator('script[src]')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('src')));
  expect(
    assets.some((path) =>
      path?.startsWith('/quantum-machine-learning-playground/assets/'),
    ),
  ).toBe(true);
});
test('state controls update probabilities; phase and camera have their own roles', async ({
  page,
}) => {
  const section = page.locator('#states');
  await section
    .getByRole('button', { name: 'Prepare |1⟩', exact: true })
    .click();
  await expect(section.getByRole('row', { name: '1 100.00%' })).toBeVisible();
  await section
    .getByRole('button', { name: 'Prepare |+⟩', exact: true })
    .click();
  const phase = section.getByRole('slider', { name: 'Relative phase φ' });
  await phase.fill('180');
  await expect(section.getByRole('row', { name: '0 50.00%' })).toBeVisible();
  await expect(section.locator('.amplitudes')).toContainText('-0.7071');
  const amplitudes = (await section.locator('.amplitudes').textContent()) ?? '';
  await section.getByRole('slider', { name: 'Camera view' }).fill('150');
  await expect(section.locator('.amplitudes')).toHaveText(amplitudes);
  await section.getByRole('button', { name: 'Reset explorer' }).click();
  await expect(phase).toHaveValue('0');
});
test('single measurement collapses and repeating it retains the outcome', async ({
  page,
}) => {
  const section = page.locator('#measurement');
  await section
    .getByRole('button', { name: 'Measure once', exact: true })
    .click();
  const text = await page.getByTestId('measurement-outcome').innerText();
  const outcome = text.match(/Outcome: ([01])/)?.[1];
  expect(outcome).toBeDefined();
  await section
    .getByRole('button', { name: 'Measure once', exact: true })
    .click();
  await expect(page.getByTestId('measurement-outcome')).toContainText(
    `Outcome: ${outcome} · 2 measurements`,
  );
  await expect(
    section
      .getByRole('region', { name: 'Measure the current qubit' })
      .getByRole('row', { name: `${outcome} 100.00%` }),
  ).toBeVisible();
  await section.getByRole('button', { name: 'Prepare again' }).click();
  await expect(page.getByTestId('measurement-outcome')).toHaveText(
    'Prepared, awaiting measurement.',
  );
  await expect(
    section
      .getByRole('region', { name: 'Measure the current qubit' })
      .getByRole('row', { name: '0 50.00%' }),
  ).toBeVisible();
});
test('collects fresh shots and starts a new dataset when preparation changes', async ({
  page,
}) => {
  const section = page.locator('#measurement');
  const repeated = section.getByRole('region', {
    name: 'Repeat the experiment',
  });
  await page.evaluate(() => {
    const values = [0.1, 0.9];
    let i = 0;
    Math.random = () => values[i++ % 2];
  });
  await section.getByRole('button', { name: 'Measure once' }).click();
  await repeated
    .getByRole('button', { name: 'Collect 10 shots', exact: true })
    .click();
  await expect(
    repeated.getByRole('row', { name: '0 50.00% 5 50.00%' }),
  ).toBeVisible();
  await expect(
    repeated.getByRole('row', { name: '1 50.00% 5 50.00%' }),
  ).toBeVisible();
  await repeated
    .getByRole('button', { name: 'Collect 100 shots', exact: true })
    .click();
  await expect(repeated.getByRole('status')).toContainText('110 shots');
  await section
    .getByRole('slider', { name: 'Preparation polar angle' })
    .fill('180');
  await expect(repeated.getByRole('status')).toContainText('0 shots');
  await repeated
    .getByRole('button', { name: 'Collect 10 shots', exact: true })
    .click();
  await expect(
    repeated.getByRole('row', { name: '1 100.00% 10 100.00%' }),
  ).toBeVisible();
  await repeated.getByRole('button', { name: 'Reset histogram' }).click();
  await expect(repeated.getByRole('status')).toContainText('0 shots');
});
test('circuit gates, undo, interference, and mixture comparison derive different outputs', async ({
  page,
}) => {
  const section = page.locator('#gates');
  await section
    .getByRole('button', { name: 'H → Z → H: reveal the phase' })
    .click();
  await expect(
    section
      .locator('.experiment')
      .locator(':scope > .distribution')
      .getByRole('row', { name: '1 100.00%' }),
  ).toBeVisible();
  await section.getByRole('button', { name: 'Undo gate' }).click();
  await expect(
    section
      .locator('.experiment')
      .locator(':scope > .distribution')
      .getByRole('row', { name: '1 50.00%' }),
  ).toBeVisible();
  const phase = section.getByRole('region', {
    name: 'Phase interference experiment',
  });
  await phase.getByRole('button', { name: '180° phase' }).click();
  await expect(phase.getByRole('row', { name: '1 100.00%' })).toBeVisible();
  await phase.getByRole('button', { name: '90° phase' }).click();
  await expect(phase.getByRole('row', { name: '0 50.00%' })).toBeVisible();
  const mixture = section.getByRole('region', {
    name: 'Coherent and mixed comparison',
  });
  await mixture.getByRole('checkbox').check();
  await expect(
    mixture
      .locator('.distribution')
      .nth(0)
      .getByRole('row', { name: '0 100.00%' }),
  ).toBeVisible();
  await expect(
    mixture
      .locator('.distribution')
      .nth(1)
      .getByRole('row', { name: '0 50.00%' }),
  ).toBeVisible();
  await section.getByRole('button', { name: 'Reset gates and phase' }).click();
  await expect(mixture.getByRole('checkbox')).not.toBeChecked();
  await expect(phase.getByRole('slider')).toHaveValue('0');
});
test('Bell and classical mixture agree in Z and differ in X, resetting joint samples', async ({
  page,
}) => {
  const section = page.locator('#entanglement');
  const joint = section
    .locator('.experiment')
    .locator(':scope > .distribution');
  await expect(
    joint.getByRole('row', { name: '00 50.00% 0 No shots' }),
  ).toBeVisible();
  await section.getByLabel('Joint measurement basis').selectOption('X');
  await expect(
    joint.getByRole('row', { name: '++ 50.00% 0 No shots' }),
  ).toBeVisible();
  await section
    .getByRole('button', { name: 'Collect 100 joint shots', exact: true })
    .click();
  await expect(joint.getByRole('status')).toContainText('100 shots');
  await section.getByLabel('Joint preparation').selectOption('mixture');
  await expect(joint.getByRole('status')).toContainText('0 shots');
  await expect(
    joint.getByRole('row', { name: '++ 25.00% 0 No shots' }),
  ).toBeVisible();
  await section.getByLabel('Joint preparation').selectOption('independent');
  await expect(
    joint.getByRole('row', { name: '++ 100.00% 0 No shots' }),
  ).toBeVisible();
  await section
    .getByRole('button', { name: 'Reset two-qubit experiment' })
    .click();
  await expect(section.getByLabel('Joint measurement basis')).toHaveValue('Z');
  await expect(section.getByLabel('Joint preparation')).toHaveValue('bell');
});
test('training reaches reference values, prevents overlaps, and reset cancels work', async ({
  page,
}) => {
  const section = page.locator('#learning');
  await section.getByRole('button', { name: 'Train 20 steps' }).click();
  await expect(
    section.getByRole('button', { name: 'One training step' }),
  ).toBeDisabled();
  await expect(page.getByTestId('step')).toHaveText('20');
  expect(Number(await page.getByTestId('parameter').innerText())).toBeCloseTo(
    1.03339106093,
    9,
  );
  expect(Number(await page.getByTestId('loss').innerText())).toBeLessThan(
    0.0001,
  );
  await section.getByRole('button', { name: 'Reset training' }).click();
  await section.getByRole('button', { name: 'Train 20 steps' }).click();
  await section.getByRole('button', { name: 'Reset training' }).click();
  await page.waitForTimeout(200);
  await expect(page.getByTestId('step')).toHaveText('0');
  await expect(page.getByTestId('loss')).toHaveText('0.5000000000');
  await section.getByRole('button', { name: 'One training step' }).click();
  expect(Number(await page.getByTestId('parameter').innerText())).toBeCloseTo(
    0.1732050808,
    9,
  );
});
test('answers retain first attempt, math and progress persist, and reset is scoped', async ({
  page,
}) => {
  const section = page.locator('#states');
  const check = section.locator('.knowledge-check');
  await check.getByLabel('0.5', { exact: true }).check();
  await check.getByRole('button', { name: 'Show answer' }).click();
  await expect(check.locator('.first-attempt')).toHaveText(
    'Your first response: 0.5',
  );
  await check.getByLabel('0.25', { exact: true }).check();
  await expect(check.locator('.first-attempt')).toHaveText(
    'Your first response: 0.5',
  );
  await section
    .locator('.math-panel')
    .getByText('Show the math', { exact: false })
    .click();
  await section.getByRole('button', { name: 'Mark section complete' }).click();
  await page
    .getByRole('navigation', { name: 'Chapters' })
    .getByRole('link', { name: /States & amplitudes/ })
    .click();
  await page.evaluate(() => localStorage.setItem('unrelated-app', 'keep'));
  await page.reload();
  await expect(
    section.getByRole('button', { name: '✓ Section complete' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(check.locator('.first-attempt')).toHaveText(
    'Your first response: 0.5',
  );
  await expect(section.locator('.math-panel')).toHaveAttribute('open', '');
  await page
    .getByRole('button', { name: 'Reset progress', exact: true })
    .click();
  await expect(check.locator('.first-attempt')).toHaveCount(0);
  await expect(
    section.getByRole('button', { name: 'Mark section complete' }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('unrelated-app'))).toBe(
    'keep',
  );
});
test('storage failure and invalid data do not stop learning', async ({
  page,
}) => {
  await page.evaluate(() =>
    localStorage.setItem('quantum-ml-playground:progress:v1', '{bad'),
  );
  await page.reload();
  await expect(page.getByTestId('loss')).toHaveText('0.5000000000');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage unavailable');
      },
    });
  });
  await page.reload();
  await page
    .locator('#learning')
    .getByRole('button', { name: 'One training step' })
    .click();
  await expect(page.getByTestId('step')).toHaveText('1');
});
test('all math panels fit desktop and narrow mobile; SVG works without WebGL', async ({
  page,
}, testInfo) => {
  for (const summary of await page.locator('.math-panel summary').all())
    await summary.click();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  const overflowing = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflowing).toBe(false);
  await page.goto('./#states');
  await expect(
    page.getByRole('img', { name: /Bloch state vector:/ }),
  ).toBeVisible();
  await page
    .getByRole('img', { name: /Bloch state vector:/ })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: `work/${testInfo.project.name}-states.png` });
  await page.goto('./');
  await page.screenshot({ path: `work/${testInfo.project.name}-landing.png` });
});
test('reduced-motion training still reaches the final values', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page
    .locator('#learning')
    .getByRole('button', { name: 'Train 20 steps' })
    .click();
  await expect(page.getByTestId('step')).toHaveText('20');
  expect(Number(await page.getByTestId('loss').innerText())).toBeLessThan(
    0.0001,
  );
});
test('training from the manual slider boundary keeps the displayed angle consistent', async ({
  page,
}) => {
  const section = page.locator('#learning');
  const slider = section.getByRole('slider', { name: 'Trainable parameter w' });
  await slider.focus();
  await slider.press('Home');
  const before = Number(await page.getByTestId('loss').innerText());
  await section.getByRole('button', { name: 'One training step' }).click();
  const parameter = Number(await page.getByTestId('parameter').innerText());
  expect(parameter).toBeGreaterThan(-Math.PI);
  expect(parameter).toBeLessThan(Math.PI);
  expect(Number(await slider.inputValue())).toBeCloseTo(parameter, 9);
  expect(Number(await page.getByTestId('loss').innerText())).toBeLessThan(
    before,
  );
});
