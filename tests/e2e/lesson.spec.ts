import { test as base, expect, type Page } from '@playwright/test';
import { lessons, stages } from '../../src/lessons/foundations/content';
const lessonIds = lessons.map((lesson) => lesson.id);
async function openLesson(page: Page, id: string) {
  await page.goto(`./#${id}`);
  await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator('.lesson-section #page-heading')).toBeVisible();
  return page.locator('.lesson-section');
}
async function openNavigation(page: Page) {
  const opener = page.getByRole('button', {
    name: 'Open lesson menu',
    exact: true,
  });
  if (await opener.isVisible()) await opener.click();
}
async function expectEnglish(page: Page) {
  const copy = await page.evaluate(() =>
    [
      document.body.innerText,
      ...Array.from(
        document.querySelectorAll(
          '[aria-label], [alt], [title], [placeholder]',
        ),
        (node) =>
          ['aria-label', 'alt', 'title', 'placeholder']
            .map((attribute) => node.getAttribute(attribute) ?? '')
            .join('\n'),
      ),
    ].join('\n'),
  );
  expect(copy).not.toMatch(
    /[ıİşŞğĞüÜçÇ]|\b(?:dersler|kavram|merhaba|kuantum|deney|genlik)\b/i,
  );
}
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
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expectEnglish(page);
  await page.getByRole('link', { name: 'Start learning' }).click();
  await expect(page).toHaveURL(/#why$/);
  await expect(page.locator('.lesson-section')).toHaveCount(1);
  await openNavigation(page);
  await page
    .getByRole('navigation', { name: 'Lessons', exact: true })
    .locator('a[href="#states"]')
    .click();
  await expect(page).toHaveURL(/#states$/);
  await expect(page.locator('.lesson-section #page-heading')).toBeVisible();
  await expect(page.locator('#why')).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/#why$/);
  await expect(page.locator('.lesson-section #page-heading')).toBeVisible();
  await page.goto('./#learning');
  await expect(page.locator('.lesson-section #page-heading')).toBeVisible();
  await expect(page.getByTestId('loss')).toHaveText('0.5000000000');
  await page.reload();
  await expect(page.locator('.lesson-section #page-heading')).toBeVisible();
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
  await page.goto('./#states');
  const section = page.locator('.lesson-section');
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
  await page.goto('./#measurement');
  const section = page.locator('.lesson-section');
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
  await page.goto('./#measurement');
  const section = page.locator('.lesson-section');
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
  await page.goto('./#gates');
  const section = page.locator('.lesson-section');
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
  await page.goto('./#entanglement');
  const section = page.locator('.lesson-section');
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
  await page.goto('./#learning');
  const section = page.locator('.lesson-section');
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
  await page.goto('./#states');
  const section = page.locator('.lesson-section');
  const check = section.locator('.knowledge-check');
  await check.getByRole('radio').nth(1).check();
  await check.getByRole('button', { name: 'Check answer' }).click();
  const first = (await check.locator('.first-attempt').textContent()) ?? '';
  expect(first).toContain('First response:');
  await check.getByRole('radio').nth(0).check();
  await expect(check.locator('.first-attempt')).toHaveText(first);
  await section
    .locator('.math-panel')
    .getByText('Explore the math', { exact: false })
    .click();
  await section.getByRole('button', { name: 'Mark lesson complete' }).click();
  await openNavigation(page);
  await page
    .getByRole('navigation', { name: 'Lessons', exact: true })
    .locator('a[href="#gates"]')
    .click();
  await expect(page.locator('#gates .math-panel')).not.toHaveAttribute('open');
  await openNavigation(page);
  await page
    .getByRole('navigation', { name: 'Lessons', exact: true })
    .locator('a[href="#states"]')
    .click();
  await page.evaluate(() => localStorage.setItem('unrelated-app', 'keep'));
  await page.reload();
  await expect(
    section.getByRole('button', { name: 'Completed' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(check.locator('.first-attempt')).toHaveText(first);
  await expect(section.locator('.math-panel')).toHaveAttribute('open', '');
  await page.goto('./');
  await page.getByRole('link', { name: 'Continue learning' }).click();
  await expect(page).toHaveURL(/#states$/);
  await openNavigation(page);
  await page
    .getByRole('button', { name: 'Reset progress', exact: true })
    .click();
  await openLesson(page, 'states');
  await expect(check.locator('.first-attempt')).toHaveCount(0);
  await expect(
    section.getByRole('button', { name: 'Mark lesson complete' }),
  ).toBeVisible();
  await expect(section.locator('.math-panel')).not.toHaveAttribute('open');
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
  await page.goto('./#learning');
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
  test.setTimeout(90_000);
  for (const id of lessonIds) {
    const section = await openLesson(page, id);
    await section.locator('.math-panel summary').click();
    await section.locator('details').evaluateAll((details) => {
      for (const detail of details) (detail as HTMLDetailsElement).open = true;
    });
    await expect(page.locator('.katex-error')).toHaveCount(0);
    await expectEnglish(page);
    const downloads = await section
      .locator('a[download]')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).href),
      );
    for (const url of downloads) {
      const response = await page.request.get(url);
      expect(response.ok(), `${id}: ${url}`).toBe(true);
      expect(response.headers()['content-type'], `${id}: ${url}`).not.toContain(
        'text/html',
      );
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
      `${id} overflows the viewport`,
    ).toBe(false);
  }
  await page.goto('./#states');
  await expect(
    page.getByRole('img', { name: /Bloch state vector:/ }),
  ).toBeVisible();
  await page
    .getByRole('img', { name: /Bloch state vector:/ })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: `work/${testInfo.project.name}-states.png` });
  await page.goto('./');
  await expectEnglish(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
  await page.screenshot({ path: `work/${testInfo.project.name}-landing.png` });
});

test('project downloads serve real learning files under the Pages subpath', async ({
  page,
}) => {
  await page.goto('./#projects');
  await expect(page.locator('#page-heading')).toBeVisible();
  await expectEnglish(page);
  const files = await page
    .locator('a[download]')
    .evaluateAll((links) => [
      ...new Set(links.map((link) => (link as HTMLAnchorElement).href)),
    ]);
  expect(files.length).toBeGreaterThan(3);
  expect(files.some((url) => url.endsWith('.zip'))).toBe(true);
  expect(files.some((url) => url.endsWith('.py'))).toBe(true);
  for (const url of files) {
    expect(url).toContain('/quantum-machine-learning-playground/downloads/');
    const response = await page.request.get(url);
    expect(response.ok(), url).toBe(true);
    expect(response.headers()['content-type'], url).not.toContain('text/html');
    const body = await response.body();
    expect(body.byteLength, url).toBeGreaterThan(50);
    if (url.endsWith('.zip'))
      expect(body.subarray(0, 4).toString()).toBe('PK\u0003\u0004');
    else if (url.endsWith('.ipynb')) {
      const notebook = JSON.parse(body.toString()) as {
        nbformat: number;
        cells: unknown[];
      };
      expect(notebook.nbformat).toBe(4);
      expect(notebook.cells.length).toBeGreaterThan(1);
    } else if (url.endsWith('.py')) {
      expect(body.toString()).toMatch(/(?:import |def )/);
      expect(body.toString()).not.toContain('<!doctype html>');
    }
  }
});

test('detailed lessons expose derivations, reveal a worked solution, and copy exact code', async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.copiedCode = text;
        },
      },
    });
  });
  const lesson = lessons.find(
    (item) =>
      item.sections?.some((section) => section.code) &&
      item.sections.some((section) => section.exercise),
  );
  expect(lesson).toBeDefined();
  const section = await openLesson(page, lesson!.id);
  await expect(section.locator('.lesson-detail-section')).not.toHaveCount(0);
  const exercise = section.locator('.practice-card').first();
  await expect(exercise.locator('details')).not.toHaveAttribute('open');
  await exercise.getByText('Show worked solution', { exact: true }).click();
  await expect(exercise.locator('details > p')).toBeVisible();
  expect(
    (await exercise.locator('details > p').innerText()).length,
  ).toBeGreaterThan(30);
  const example = section.locator('.code-example').first();
  const exactCode = await example.locator('code').textContent();
  await example.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(example.getByRole('status')).toHaveText('Code copied.');
  expect(
    await page.evaluate(() => document.documentElement.dataset.copiedCode),
  ).toBe(exactCode);
  await expectEnglish(page);
  await expect(page.locator('.katex-error')).toHaveCount(0);
});

test('a denied clipboard selects the code and explains keyboard copying', async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new DOMException(
            'Clipboard permission denied',
            'NotAllowedError',
          );
        },
      },
    });
  });
  const lesson = lessons.find((item) =>
    item.sections?.some((section) => section.code),
  );
  expect(lesson).toBeDefined();
  const section = await openLesson(page, lesson!.id);
  const example = section.locator('.code-example').first();
  const exactCode = await example.locator('code').textContent();
  await example.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(example.getByRole('status')).toHaveText(
    'Code selected. Press Ctrl+C or Command+C to copy.',
  );
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(
    exactCode,
  );
  await expectEnglish(page);
});

test('Gaussian position and wave-number widths trade off while their product stays fixed', async ({
  page,
}) => {
  await openLesson(page, 'wavefunctions');
  const lab = page.getByRole('region', {
    name: 'Wavefunction and uncertainty laboratory',
  });
  await lab
    .getByRole('button', { name: 'Localize position', exact: true })
    .click();
  await expect(lab.getByTestId('position-uncertainty')).toHaveText('0.2500');
  await expect(lab.getByTestId('wave-number-uncertainty')).toHaveText('2.0000');
  await lab.getByRole('slider', { name: 'Position width σx' }).fill('0.5');
  await expect(lab.getByTestId('wave-number-uncertainty')).toHaveText('1.0000');
  const product =
    Number(await lab.getByTestId('position-uncertainty').innerText()) *
    Number(await lab.getByTestId('wave-number-uncertainty').innerText());
  expect(product).toBe(0.5);
  await lab
    .getByRole('button', { name: 'Reset wavefunction', exact: true })
    .click();
  await expect(
    lab.getByRole('slider', { name: 'Position width σx' }),
  ).toHaveValue('0.75');
  await expect(
    lab.getByRole('img', { name: /Position probability density/ }),
  ).toBeVisible();
});

test('box energy levels grow as n squared and a two-state density evolves at fixed mean energy', async ({
  page,
}) => {
  await openLesson(page, 'potential-well');
  const lab = page.getByRole('region', {
    name: 'Particle in a box laboratory',
  });
  const level = lab.getByRole('slider', { name: 'Energy level n' });
  await level.fill('2');
  await expect(lab.getByTestId('box-energy')).toHaveText('4.0000');
  await expect(lab.getByTestId('box-center-density')).toHaveText('0.0000');
  await level.fill('3');
  await expect(lab.getByTestId('box-energy')).toHaveText('9.0000');
  await expect(lab.getByTestId('box-center-density')).toHaveText('2.0000');
  await lab.getByRole('button', { name: 'Combine n = 1 and n = 2' }).click();
  const curve = lab.locator('.plot').first().locator('polyline');
  const before = await curve.getAttribute('points');
  await lab.getByRole('slider', { name: 'Relative phase φ' }).fill('180');
  await expect(curve).not.toHaveAttribute('points', before!);
  await expect(lab.getByTestId('box-energy')).toHaveText('2.5000');
  await lab.getByRole('button', { name: 'Reset box', exact: true }).click();
  await expect(level).toHaveValue('1');
  await expect(lab.getByTestId('box-energy')).toHaveText('1.0000');
});

test('spin phase leaves Z outcomes fixed and reverses certainty in X', async ({
  page,
}) => {
  await openLesson(page, 'spin');
  const lab = page.getByRole('region', { name: 'Spin measurement laboratory' });
  const z = lab.getByRole('table', {
    name: 'Measure Z on fresh preparations, numerical values',
  });
  const x = lab.getByRole('table', {
    name: 'Measure X on fresh preparations, numerical values',
  });
  await lab.getByRole('button', { name: 'Certain +Z', exact: true }).click();
  await expect(
    z.getByRole('row', { name: '+ℏ/2 100.00%', exact: true }),
  ).toBeVisible();
  await expect(
    x.getByRole('row', { name: '+ℏ/2 50.00%', exact: true }),
  ).toBeVisible();
  await lab.getByRole('button', { name: 'Certain −X', exact: true }).click();
  await expect(
    z.getByRole('row', { name: '+ℏ/2 50.00%', exact: true }),
  ).toBeVisible();
  await expect(
    x.getByRole('row', { name: '−ℏ/2 100.00%', exact: true }),
  ).toBeVisible();
  await lab.getByRole('button', { name: 'Reset spin', exact: true }).click();
  await expect(
    x.getByRole('row', { name: '+ℏ/2 100.00%', exact: true }),
  ).toBeVisible();
  await expect(
    lab.getByRole('slider', { name: 'Spin relative phase φ' }),
  ).toHaveValue('0');
});

test('a pure density matrix and maximally mixed state differ in X despite identical Z probabilities', async ({
  page,
}) => {
  await openLesson(page, 'density-matrices');
  const lab = page.getByRole('region', { name: 'Density matrix laboratory' });
  const z = lab.getByRole('table', {
    name: 'Z probabilities: diagonal entries of ρ, numerical values',
  });
  const x = lab.getByRole('table', {
    name: 'X probabilities: coherence becomes visible, numerical values',
  });
  await expect(lab.getByTestId('density-purity')).toHaveText('1.0000');
  await expect(
    x.getByRole('row', { name: '+ 100.00%', exact: true }),
  ).toBeVisible();
  await lab
    .getByRole('button', { name: 'Maximally mixed', exact: true })
    .click();
  await expect(lab.getByTestId('density-purity')).toHaveText('0.5000');
  await expect(
    z.getByRole('row', { name: '0 50.00%', exact: true }),
  ).toBeVisible();
  await expect(
    x.getByRole('row', { name: '+ 50.00%', exact: true }),
  ).toBeVisible();
  await lab.getByRole('slider', { name: 'Bloch vector length r' }).fill('0.6');
  await lab.getByRole('slider', { name: 'Density direction θ' }).fill('0');
  await expect(lab.getByTestId('density-purity')).toHaveText('0.6800');
  await expect(
    z.getByRole('row', { name: '0 80.00%', exact: true }),
  ).toBeVisible();
  await lab
    .getByRole('button', { name: 'Reset density matrix', exact: true })
    .click();
  await expect(lab.getByTestId('density-purity')).toHaveText('1.0000');
});

test('classical regression lowers loss and manual changes start a new training history', async ({
  page,
}) => {
  await openLesson(page, 'linear-regression');
  const lab = page.getByRole('region', {
    name: 'Linear regression laboratory',
  });
  await expect(lab.getByTestId('classical-mse')).toHaveText('8.388000');
  await lab
    .getByRole('button', { name: 'One classical training step', exact: true })
    .click();
  expect(
    Number(
      await lab.getByRole('slider', { name: 'Linear slope w' }).inputValue(),
    ),
  ).toBeCloseTo(0.768, 2);
  await expect(lab).toContainText(
    'Current parameters: w = 0.768000, b = 0.200000.',
  );
  expect(
    Number(
      await lab
        .getByRole('slider', { name: 'Linear intercept b' })
        .inputValue(),
    ),
  ).toBeCloseTo(0.2, 12);
  await lab
    .getByRole('button', { name: 'Train 20 classical steps', exact: true })
    .click();
  await expect(lab.getByTestId('classical-step')).toHaveText('21');
  expect(
    Number(await lab.getByTestId('classical-mse').innerText()),
  ).toBeLessThan(0.016);
  await lab.getByRole('slider', { name: 'Linear slope w' }).fill('1');
  await expect(lab.getByTestId('classical-step')).toHaveText('0');
  await lab
    .getByRole('button', { name: 'Reset regression', exact: true })
    .click();
  await expect(lab.getByTestId('classical-mse')).toHaveText('8.388000');
});

test('gradient descent can overshoot with an excessive rate and reset restores convergence', async ({
  page,
}) => {
  await openLesson(page, 'gradient-descent');
  const lab = page.getByRole('region', { name: 'Gradient descent laboratory' });
  const initialLoss = Number(
    await lab.getByTestId('classical-mse').innerText(),
  );
  await lab.getByRole('slider', { name: 'Learning rate η' }).fill('0.6');
  await lab
    .getByRole('button', { name: 'One classical training step', exact: true })
    .click();
  expect(
    Number(await lab.getByTestId('classical-mse').innerText()),
  ).toBeGreaterThan(initialLoss);
  await lab
    .getByRole('button', { name: 'Reset gradient descent', exact: true })
    .click();
  await expect(
    lab.getByRole('slider', { name: 'Learning rate η' }),
  ).toHaveValue('0.1');
  await lab
    .getByRole('button', { name: 'Train 20 classical steps', exact: true })
    .click();
  expect(
    Number(await lab.getByTestId('classical-mse').innerText()),
  ).toBeLessThan(0.016);
});

test('logistic probabilities penalize confident errors and respond to a boundary shift', async ({
  page,
}) => {
  await openLesson(page, 'logistic-classification');
  const lab = page.getByRole('region', {
    name: 'Logistic classification laboratory',
  });
  await expect(lab.getByTestId('classification-loss')).toHaveText('0.693147');
  await expect(lab.getByTestId('classification-accuracy')).toHaveText('50.0%');
  await lab
    .getByRole('button', { name: 'A useful separator', exact: true })
    .click();
  await expect(lab.getByTestId('classification-accuracy')).toHaveText('100.0%');
  expect(
    Number(await lab.getByTestId('classification-loss').innerText()),
  ).toBeLessThan(0.14);
  await lab
    .getByRole('button', { name: 'Confident and reversed', exact: true })
    .click();
  await expect(lab.getByTestId('classification-accuracy')).toHaveText('0.0%');
  expect(
    Number(await lab.getByTestId('classification-loss').innerText()),
  ).toBeGreaterThan(3);
  await lab.getByRole('slider', { name: 'Logistic bias b' }).fill('4');
  expect(
    Number(
      (await lab.getByTestId('classification-accuracy').innerText()).replace(
        '%',
        '',
      ),
    ),
  ).toBeGreaterThan(0);
  await lab
    .getByRole('button', { name: 'Reset classification', exact: true })
    .click();
  await expect(lab.getByTestId('classification-loss')).toHaveText('0.693147');
});

test('new physics and ML lesson completions persist against the full curriculum count', async ({
  page,
}) => {
  for (const id of ['density-matrices', 'neural-networks']) {
    const section = await openLesson(page, id);
    await section
      .getByRole('button', { name: 'Mark lesson complete', exact: true })
      .click();
    await expect(
      section.getByRole('button', { name: '✓ Completed', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
  }
  await page.reload();
  await openNavigation(page);
  const progress = page.getByRole('progressbar', { name: 'Lesson progress' });
  await expect(progress).toHaveAttribute('max', String(lessonIds.length));
  await expect(progress).toHaveAttribute('value', '2');
  await expect(
    page.getByText(`2 / ${lessonIds.length} lessons completed`, {
      exact: true,
    }),
  ).toBeVisible();
});

test('captioned stories play, pause, scrub predictions, and reset when switching models', async ({
  page,
}) => {
  await page.goto('./#studio');
  await expect(page.locator('#page-heading')).toHaveText(
    'Watch an idea unfold.',
  );
  const player = page.getByTestId('story-frame');
  await expect(player).toHaveAttribute('data-progress', '0.0');
  await page.getByRole('button', { name: 'Play story', exact: true }).click();
  await expect(player).not.toHaveAttribute('data-progress', '0.0');
  await page.getByRole('button', { name: 'Pause story', exact: true }).click();
  const paused = await player.getAttribute('data-progress');
  await page.waitForTimeout(350);
  await expect(player).toHaveAttribute('data-progress', paused!);
  const progress = page.getByRole('slider', {
    name: 'Story progress',
    exact: true,
  });
  await progress.fill('50');
  await expect(player.getByRole('img')).toHaveAttribute(
    'aria-label',
    'Relative phase 3.14 radians. Output zero probability 0.000.',
  );
  await page
    .getByRole('button', { name: /A probability becomes data/ })
    .click();
  await expect(progress).toHaveValue('0');
  await progress.fill('100');
  await expect(player.getByRole('img')).toHaveAttribute(
    'aria-label',
    /100 simulated shots, \d+ ones\./,
  );
  await page
    .getByRole('button', { name: /Inside a hybrid learning step/ })
    .click();
  await progress.fill('100');
  await expect(player.getByRole('img')).toHaveAttribute(
    'aria-label',
    /Training step 40, loss 0\.0000\./,
  );
  await page
    .getByRole('button', { name: 'Restart story', exact: true })
    .click();
  await expect(progress).toHaveValue('0');
  await expectEnglish(page);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
});

test('reduced-motion stories stay paused and a preference change stops active playback', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#studio');
  const player = page.getByTestId('story-frame');
  await page.waitForTimeout(350);
  await expect(player).toHaveAttribute('data-progress', '0.0');
  await page
    .getByRole('slider', { name: 'Story progress', exact: true })
    .fill('75');
  await expect(player).toHaveAttribute('data-progress', '75.0');
  await expect(
    page.getByRole('button', { name: 'Play story', exact: true }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Play story', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Pause story', exact: true }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(
    page.getByRole('button', { name: 'Play story', exact: true }),
  ).toBeVisible();
  const paused = await player.getAttribute('data-progress');
  await page.waitForTimeout(350);
  await expect(player).toHaveAttribute('data-progress', paused!);
});

test('a two-qubit classifier trains from circuit expectations and resets after a manual angle change', async ({
  page,
}) => {
  await openLesson(page, 'variational-classifier');
  const lab = page.getByRole('region', {
    name: 'Two-qubit classification laboratory',
  });
  const initialLoss = Number(
    await lab.getByTestId('quantum-classifier-train-loss').innerText(),
  );
  await lab
    .getByRole('button', {
      name: 'Train 20 quantum classifier steps',
      exact: true,
    })
    .click();
  await expect(lab.getByTestId('quantum-classifier-steps')).toHaveText('20');
  expect(
    Number(await lab.getByTestId('quantum-classifier-train-loss').innerText()),
  ).toBeLessThan(initialLoss);
  expect(
    Number(
      await lab.getByTestId('quantum-classifier-heldout-loss').innerText(),
    ),
  ).toBeGreaterThan(0);
  await lab
    .getByText('Compare with a degree-2 classical baseline', { exact: true })
    .click();
  await expect(
    lab.getByRole('table', {
      name: 'Degree-2 reference, fitted without held-out labels.',
    }),
  ).toBeVisible();
  await lab
    .getByRole('slider', { name: 'Circuit angle w0', exact: true })
    .press('Home');
  await expect(lab.getByTestId('quantum-classifier-steps')).toHaveText('0');
  await lab
    .getByRole('button', { name: 'Reset quantum classifier', exact: true })
    .click();
  expect(
    Number(await lab.getByTestId('quantum-classifier-train-loss').innerText()),
  ).toBe(initialLoss);
  expect(
    Number(
      await lab
        .getByRole('slider', { name: 'Circuit angle w0', exact: true })
        .inputValue(),
    ),
  ).toBeCloseTo(0.35, 2);
});

test('quantum kernel similarities distinguish identical, orthogonal, and globally sign-shifted states', async ({
  page,
}) => {
  await openLesson(page, 'quantum-kernels');
  const lab = page.getByRole('region', {
    name: 'Quantum fidelity kernel laboratory',
  });
  await expect(lab.getByTestId('kernel-selected-fidelity')).toHaveText(
    '0.750000',
  );
  const angle = lab.getByRole('slider', {
    name: 'Kernel state 2 angle',
    exact: true,
  });
  await angle.fill('0');
  await expect(lab.getByTestId('kernel-selected-fidelity')).toHaveText(
    '1.000000',
  );
  await angle.fill('180');
  await expect(lab.getByTestId('kernel-selected-fidelity')).toHaveText(
    '0.000000',
  );
  await angle.fill('360');
  await expect(lab.getByTestId('kernel-selected-fidelity')).toHaveText(
    '1.000000',
  );
  await lab.getByLabel('Second kernel state').selectOption('2');
  await expect(lab.getByTestId('kernel-selected-fidelity')).toHaveText(
    '0.250000',
  );
  await lab
    .getByRole('button', { name: 'Reset quantum kernel', exact: true })
    .click();
  await expect(angle).toHaveValue('60');
  await expect(lab.getByTestId('kernel-selected-fidelity')).toHaveText(
    '0.750000',
  );
});

test('finite-shot tomography produces a physical estimate and clears samples on preparation changes', async ({
  page,
}) => {
  await openLesson(page, 'quantum-state-learning');
  const lab = page.getByRole('region', {
    name: 'Finite-shot state tomography laboratory',
  });
  await lab
    .getByRole('button', { name: 'Collect 100 shots per axis', exact: true })
    .click();
  await expect(lab.getByTestId('tomography-shots')).toHaveText('300');
  const purity = Number(await lab.getByTestId('tomography-purity').innerText());
  expect(purity).toBeGreaterThanOrEqual(0.5);
  expect(purity).toBeLessThanOrEqual(1);
  const rawLength = await lab.getByTestId('tomography-raw-norm').innerText();
  await lab
    .getByRole('button', { name: 'Collect 100 shots per axis', exact: true })
    .click();
  await expect(lab.getByTestId('tomography-raw-norm')).toHaveText(rawLength);
  await lab
    .getByRole('slider', { name: 'Tomography Bloch radius', exact: true })
    .fill('0.6');
  await expect(lab.getByTestId('tomography-shots')).toHaveText('0');
  await expect(lab.getByTestId('tomography-purity')).toHaveText('No samples');
  await lab
    .getByRole('button', { name: 'Collect 10 shots per axis', exact: true })
    .click();
  await expect(lab.getByTestId('tomography-shots')).toHaveText('30');
  await lab
    .getByRole('slider', { name: 'Tomography random seed', exact: true })
    .fill('9');
  await expect(lab.getByTestId('tomography-shots')).toHaveText('0');
  await lab
    .getByRole('button', { name: 'Reset state tomography', exact: true })
    .click();
  await expect(
    lab.getByRole('slider', { name: 'Tomography Bloch radius', exact: true }),
  ).toHaveValue('1');
  await expect(
    lab.getByRole('slider', { name: 'Tomography random seed', exact: true }),
  ).toHaveValue('7');
});
test('reduced-motion training still reaches the final values', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#learning');
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
  await page.goto('./#learning');
  const section = page.locator('.lesson-section');
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

test('leaving an active training lesson cancels its scheduled steps', async ({
  page,
}) => {
  const section = await openLesson(page, 'learning');
  await section.getByRole('button', { name: 'Train 20 steps' }).click();
  const navigation = page.getByRole('navigation', {
    name: 'Lessons',
    exact: true,
  });
  await openNavigation(page);
  await navigation.locator('a[href="#encoding"]').click();
  await expect(page.locator('.lesson-section #page-heading')).toBeVisible();
  await openNavigation(page);
  await navigation.locator('a[href="#learning"]').click();
  await expect(page.getByTestId('step')).toHaveText('0');
  await page.waitForTimeout(200);
  await expect(page.getByTestId('step')).toHaveText('0');
});

test('two path interference reverses with phase and path records remove the pattern', async ({
  page,
}) => {
  const section = await openLesson(page, 'waves');
  await section
    .getByText('Inspect amplitudes and probabilities for all 16 bins')
    .click();
  const firstBin = section.locator('tbody tr').first();
  await expect(firstBin.locator('td').nth(2)).toHaveText('12.50%');
  await section.getByRole('button', { name: 'Opposite phase · 180°' }).click();
  await expect(firstBin.locator('td').nth(2)).toHaveText('0.00%');
  await section
    .getByRole('checkbox', { name: /Record which-path information/ })
    .check();
  await expect(section.getByRole('img', { name: /6\.25/ })).toBeVisible();
  await section
    .getByRole('slider', { name: 'Relative phase between paths φ' })
    .fill('90');
  await expect(section.getByRole('img', { name: /6\.25/ })).toBeVisible();
  await section.getByRole('button', { name: 'Reset interference' }).click();
  await expect(section.getByRole('checkbox')).not.toBeChecked();
  await expect(section.getByRole('slider')).toHaveValue('0');
  await expect(firstBin.locator('td').nth(2)).toHaveText('12.50%');
});

test('amplitude and probability sliders stay normalized and demonstrate the square rule', async ({
  page,
}) => {
  const section = await openLesson(page, 'math');
  await section.getByRole('button', { name: 'α = 0.5' }).click();
  await expect(section.getByRole('row', { name: '0 25.00%' })).toBeVisible();
  await expect(section.getByRole('row', { name: '1 75.00%' })).toBeVisible();
  const amplitude = section.getByRole('slider', {
    name: 'Amplitude magnitude for outcome 0 |α|',
  });
  const probability = section.getByRole('slider', {
    name: 'Probability of outcome 0 P(0)',
  });
  await expect(probability).toHaveValue('25');
  await probability.fill('64');
  expect(Number(await amplitude.inputValue())).toBeCloseTo(0.8, 12);
  await expect(section.getByRole('row', { name: '1 36.00%' })).toBeVisible();
  await section.getByRole('button', { name: 'Certain 0' }).click();
  await expect(section.getByRole('row', { name: '0 100.00%' })).toBeVisible();
  await section.getByRole('button', { name: 'Reset amplitudes' }).click();
  await expect(section.getByRole('row', { name: '0 50.00%' })).toBeVisible();
});

test('data encoding maps input angle to Born probabilities and the Z expectation', async ({
  page,
}) => {
  const section = await openLesson(page, 'encoding');
  await section.getByRole('button', { name: 'x = 0', exact: true }).click();
  await expect(section.getByRole('row', { name: '0 100.00%' })).toBeVisible();
  await expect(page.getByTestId('encoding-expectation')).toHaveText('1.0000');
  await section.getByRole('button', { name: 'x = π', exact: true }).click();
  await expect(section.getByRole('row', { name: '1 100.00%' })).toBeVisible();
  await expect(page.getByTestId('encoding-expectation')).toHaveText('-1.0000');
  await section.getByRole('slider', { name: 'Data angle x' }).fill('1.0472');
  await expect(section.getByRole('row', { name: '0 75.00%' })).toBeVisible();
  expect(
    Number(await page.getByTestId('encoding-expectation').innerText()),
  ).toBeCloseTo(0.5, 4);
  await section.getByRole('button', { name: 'Reset encoding' }).click();
  await expect(section.getByRole('row', { name: '0 50.00%' })).toBeVisible();
  await expect(page.getByTestId('encoding-expectation')).toHaveText('0.0000');
});

test('depolarization moves probabilities toward an input independent complete mixture', async ({
  page,
}) => {
  const section = await openLesson(page, 'noise');
  const noisy = section.locator('.distribution').nth(1);
  expect(
    Number(await page.getByTestId('noise-expectation').innerText()),
  ).toBeCloseTo(0.375, 4);
  await section.getByRole('button', { name: 'Ideal state · p = 0' }).click();
  await expect(noisy.getByRole('row', { name: '0 75.00%' })).toBeVisible();
  await section.getByRole('button', { name: 'Fully mixed · p = 1' }).click();
  await expect(noisy.getByRole('row', { name: '0 50.00%' })).toBeVisible();
  await expect(noisy.getByRole('row', { name: '1 50.00%' })).toBeVisible();
  await section.getByRole('slider', { name: 'Preparation angle θ' }).fill('0');
  await expect(noisy.getByRole('row', { name: '0 50.00%' })).toBeVisible();
  await section
    .getByRole('slider', { name: 'Preparation angle θ' })
    .fill('180');
  await expect(noisy.getByRole('row', { name: '0 50.00%' })).toBeVisible();
  await section.getByRole('button', { name: 'Reset noise' }).click();
  await expect(
    section.getByRole('slider', { name: 'Preparation angle θ' }),
  ).toHaveValue('60');
  await expect(
    section.getByRole('slider', { name: 'Depolarizing amount p' }),
  ).toHaveValue('0.25');
  await expect(noisy.getByRole('row', { name: '0 68.75%' })).toBeVisible();
});

test('course filters and search find lessons and provide an empty state', async ({
  page,
}) => {
  const path = page.locator('#path');
  const rows = path.locator('.lesson-list > li');
  await expect(rows).toHaveCount(lessonIds.length);
  const qmlStageNumber = stages.findIndex((stage) => stage.id === 'qml') + 1;
  await path
    .getByRole('button', {
      name: `Stage ${String(qmlStageNumber).padStart(2, '0')}`,
      exact: true,
    })
    .click();
  await expect(path.locator('.lesson-list a[href="#encoding"]')).toBeVisible();
  await expect(path.locator('.lesson-list a[href="#waves"]')).toHaveCount(0);
  await path.getByRole('button', { name: 'All lessons', exact: true }).click();
  await expect(rows).toHaveCount(lessonIds.length);
  const search = page.getByRole('searchbox', { name: 'Search lessons' });
  await search.fill('noise');
  await expect(path.locator('.lesson-list a[href="#noise"]')).toBeVisible();
  await expect(path.locator('.lesson-list a[href="#why"]')).toHaveCount(0);
  await search.fill('unknown-concept-123');
  await expect(rows).toHaveCount(0);
  await expect(path.locator('.empty-state')).toBeVisible();
  await search.clear();
  await expect(rows).toHaveCount(lessonIds.length);
});

test('glossary search links a concept to its lesson and sources are usable', async ({
  page,
}) => {
  await page.goto('./#glossary');
  await expect(page.locator('#page-heading')).toHaveText(/glossary/i);
  const search = page.getByRole('searchbox', { name: 'Search glossary' });
  await search.fill('amplitude');
  await expectEnglish(page);
  const terms = page.locator('.glossary-section dt a');
  const amplitudeTerm = page.getByRole('link', {
    name: 'Amplitude',
    exact: true,
  });
  await expect(amplitudeTerm).toHaveAttribute('href', '#states');
  await amplitudeTerm.click();
  await expect(page).toHaveURL(/#states$/);
  await expect(page.locator('.lesson-section')).toHaveCount(1);
  await page.goto('./#glossary');
  await search.fill('unknown-concept-123');
  await expect(terms).toHaveCount(0);
  await expect(page.locator('.glossary-section .empty-state')).toBeVisible();
  await page.goto('./#sources');
  await expect(page.locator('#page-heading')).toHaveText(
    'Reliable references.',
  );
  await expectEnglish(page);
  const sources = await page.locator('.references li a').evaluateAll((nodes) =>
    nodes.map((node) => ({
      href: node.getAttribute('href'),
      target: node.getAttribute('target'),
      rel: node.getAttribute('rel'),
    })),
  );
  expect(sources.length).toBeGreaterThan(5);
  for (const source of sources) {
    expect(source.href).toMatch(/^https:\/\//);
    expect(source.target).toBe('_blank');
    expect(source.rel).toContain('noreferrer');
  }
});
