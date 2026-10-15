import { readFile } from 'node:fs/promises';
import { expect, test as base, type Page } from '@playwright/test';
import { assessments } from '../../src/lessons/assessments';
import { lessons } from '../../src/lessons/foundations/content';
import { quantumLessons } from '../../src/lessons/foundations/quantum';

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

test.use({ reducedMotion: 'reduce' });

async function expectEnglishLesson(page: Page) {
  const copy = await page
    .locator('.lesson-section')
    .evaluate((lesson) =>
      [
        (lesson as HTMLElement).innerText,
        ...Array.from(
          lesson.querySelectorAll('[aria-label], [alt], [placeholder]'),
          (node) =>
            ['aria-label', 'alt', 'placeholder']
              .map((attribute) => node.getAttribute(attribute) ?? '')
              .join('\n'),
        ),
      ].join('\n'),
    );
  expect(copy).not.toMatch(
    /[ıİşŞğĞüÜçÇ]|\b(?:dersler|kavram|merhaba|kuantum|deney|genlik)\b/i,
  );
  await expect(page.locator('.katex-error')).toHaveCount(0);
}

test('the second module connects four lessons to its own notebooks and the physics module', async ({
  page,
}) => {
  await page.goto('./#intuition-code');
  const navigation = page.getByRole('navigation', {
    name: 'Lesson navigation',
    exact: true,
  });
  await expect(navigation.locator('a[href="#states"]')).toHaveCount(1);
  await navigation.locator('a[href="#states"]').click();
  for (const [index, lesson] of quantumLessons.entries()) {
    await expect(page).toHaveURL(new RegExp(`#${lesson.id}$`));
    await expect(page.locator('#page-heading')).toHaveText(lesson.title);
    await expect(page.getByTestId('practice-deck')).toHaveCount(1);
    await expect(page.locator(`#${lesson.id}-lab`)).toBeAttached();
    expect(
      await page.locator('.quantum-concept .quantum-figure').count(),
    ).toBeGreaterThan(0);
    const sequence = await page
      .locator('.quantum-lesson-content')
      .evaluate((element) => {
        const idea = element
          .querySelector('.quantum-reading')!
          .getBoundingClientRect();
        const experiment = element
          .querySelector('.quantum-experiment')!
          .getBoundingClientRect();
        const practice = element
          .querySelector('.quantum-practice')!
          .getBoundingClientRect();
        return {
          ideaBottom: idea.bottom,
          experimentTop: experiment.top,
          experimentBottom: experiment.bottom,
          practiceTop: practice.top,
        };
      });
    expect(sequence.experimentTop).toBeGreaterThanOrEqual(sequence.ideaBottom);
    expect(sequence.practiceTop).toBeGreaterThanOrEqual(
      sequence.experimentBottom,
    );
    await expect(
      page.getByRole('region', { name: 'Lesson completion' }),
    ).toBeAttached();
    await expectEnglishLesson(page);
    const next = quantumLessons[index + 1]?.id ?? 'quantum-code';
    await navigation.locator(`a[href="#${next}"]`).click();
  }
  await expect(page).toHaveURL(/#quantum-code$/);
  await expect(page.getByTestId('notebook-viewer')).toHaveCount(1);
  const module = lessons.filter((lesson) => lesson.stage === 'quantum');
  const menu = page.getByRole('button', {
    name: 'Open lesson menu',
    exact: true,
  });
  if (await menu.isVisible()) await menu.click();
  expect(
    await page
      .locator('.nav-stage')
      .nth(1)
      .locator('a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
  ).toEqual(module.map((lesson) => `#${lesson.id}`));
  const closeMenu = page.getByRole('button', {
    name: 'Close navigation',
    exact: true,
  });
  if (await closeMenu.isVisible()) await closeMenu.click();
  const quantumCodeIndex = lessons.findIndex(
    (lesson) => lesson.id === 'quantum-code',
  );
  const nextLesson = lessons[quantumCodeIndex + 1];
  expect(nextLesson.stage).toBe('physics');
  await expect(navigation.locator(`a[href="#${nextLesson.id}"]`)).toHaveCount(
    1,
  );
});

test('authored diagrams connect basis, uncertainty, circuit order, and local statistics to their numbers', async ({
  page,
}) => {
  await page.goto('./#states');
  const basis = page.locator('.quantum-figure').filter({
    has: page.getByRole('group', { name: 'Basis for the state prediction' }),
  });
  await basis
    .getByRole('button', { name: 'Measure in X', exact: true })
    .click();
  await expect(basis.getByRole('status')).toContainText('100% for +');
  await basis
    .getByRole('group', { name: 'Bloch cross-section state' })
    .getByRole('button', { name: '|−⟩', exact: true })
    .click();
  await expect(basis.getByRole('status')).toContainText('0% for +');
  await basis
    .getByRole('button', { name: 'Measure in Z', exact: true })
    .click();
  await expect(basis.getByRole('status')).toContainText('50% for 0');

  await page.goto('./#measurement');
  const uncertainty = page.locator('.quantum-figure').filter({
    has: page.getByRole('group', {
      name: 'Number of independent shots for uncertainty',
    }),
  });
  await expect(uncertainty.getByRole('status')).toContainText(
    '4.33 percentage points',
  );
  await uncertainty
    .getByRole('button', { name: '400 shots', exact: true })
    .click();
  await expect(uncertainty.getByRole('status')).toContainText(
    '2.17 percentage points',
  );

  await page.goto('./#gates');
  const order = page
    .locator('.quantum-figure')
    .filter({ has: page.getByRole('group', { name: 'Gate order readout' }) });
  await order
    .getByRole('button', { name: 'Add H before readout', exact: true })
    .click();
  const probabilities = order.locator('.quantum-probability-bars');
  await expect(probabilities.nth(0).locator('dd strong')).toHaveText([
    '0%',
    '100%',
  ]);
  await expect(probabilities.nth(1).locator('dd strong')).toHaveText([
    '100%',
    '0%',
  ]);

  await page.goto('./#entanglement');
  const local = page.locator('.quantum-figure').filter({
    has: page.getByRole('group', { name: 'Local gate on q0 of Bell pair' }),
  });
  await local
    .getByRole('button', { name: 'Apply X to q0', exact: true })
    .click();
  await expect(
    local.locator('.quantum-probability-bars').first().locator('dd strong'),
  ).toHaveText(['0%', '50%', '50%', '0%']);
  await expect(
    local.locator('.quantum-probability-bars').last().locator('dd strong'),
  ).toHaveText(['50%', '50%']);
  await local
    .getByRole('button', { name: 'Apply H to q0', exact: true })
    .click();
  await expect(
    local.locator('.quantum-probability-bars').first().locator('dd strong'),
  ).toHaveText(['25%', '25%', '25%', '25%']);
  await expect(
    local.locator('.quantum-probability-bars').last().locator('dd strong'),
  ).toHaveText(['50%', '50%']);
});

test('worked practice is one prompt at a time and keeps reading position and keyboard focus', async ({
  page,
}) => {
  for (const lesson of quantumLessons) {
    await page.goto(`./#${lesson.id}`);
    const deck = page.getByTestId('practice-deck');
    const firstExercise = lesson.sections!.find((section) => section.exercise)!;
    await expect(deck.locator('.practice-deck-prompt h3')).toHaveText(
      firstExercise.title,
    );
    await expect(deck.locator('.practice-deck-prompt')).toHaveCount(1);
    const reasoning =
      'I will predict the probability before checking the calculation.';
    await deck.getByRole('textbox', { name: /Your reasoning/ }).fill(reasoning);
    const trigger = deck.getByRole('button', {
      name: 'Compare with the explanation',
    });
    await trigger.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      scroll: window.scrollY,
    }));
    await trigger.click();
    const dialog = page.getByRole('dialog', {
      name: firstExercise.title,
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(firstExercise.exercise!.solution);
    await expect(dialog).toContainText(reasoning);
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight),
    ).toBe(before.height);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(before.scroll);
    await deck.getByRole('button', { name: 'Next practice prompt' }).click();
    await expect(deck.getByRole('textbox')).toHaveValue('');
    await deck
      .getByRole('button', { name: 'Previous practice prompt' })
      .click();
    await expect(deck.getByRole('textbox')).toHaveValue(reasoning);
    await expect(page.locator('.lesson-section details')).toHaveCount(0);
  }
});

for (const lesson of quantumLessons) {
  test(`${lesson.short}: optional quiz pauses, explains mistakes, retries, and never gates completion`, async ({
    page,
  }) => {
    await page.goto(`./#${lesson.id}`);
    const assessment = assessments[lesson.id as keyof typeof assessments];
    const card = page.getByRole('region', {
      name: 'Check your understanding',
      exact: true,
    });
    const quiz = page.getByRole('dialog', {
      name: 'Check your understanding',
      exact: true,
    });
    const completion = page.getByRole('region', { name: 'Lesson completion' });
    await completion
      .getByRole('button', { name: 'Mark lesson complete', exact: true })
      .click();
    await expect(
      completion.getByRole('button', { name: '✓ Completed', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await card
      .getByRole('button', { name: 'Start the quiz', exact: true })
      .click();
    for (const [index, question] of assessment.questions.entries()) {
      await expect(quiz.getByRole('group')).toHaveAccessibleName(
        question.prompt,
      );
      await expect(quiz.locator('fieldset')).toHaveCount(1);
      await expect(
        quiz.getByRole('button', { name: 'Check answer', exact: true }),
      ).toBeDisabled();
      const choice =
        index === 0
          ? (question.correct + 1) % question.choices.length
          : question.correct;
      await quiz.getByRole('radio').nth(choice).check();
      await quiz
        .getByRole('button', { name: 'Check answer', exact: true })
        .click();
      await expect(quiz.getByRole('status')).toContainText(
        question.choices[choice].explanation,
      );
      await expect(quiz.getByRole('radio')).toHaveCount(0);
      if (index === 0) {
        await page.keyboard.press('Escape');
        await expect(quiz).not.toBeVisible();
        const resume = card.getByRole('button', {
          name: 'Resume quiz',
          exact: true,
        });
        await expect(resume).toBeFocused();
        await page.reload();
        await resume.click();
        await expect(quiz.locator('.assessment-your-answer')).toContainText(
          question.choices[choice].text,
        );
        await expect(quiz.getByRole('radio')).toHaveCount(0);
      }
      await quiz
        .getByRole('button', {
          name:
            index === assessment.questions.length - 1
              ? 'See my result'
              : 'Next question',
          exact: true,
        })
        .click();
    }
    await expect(quiz).not.toBeVisible();
    await expect(card.locator('.assessment-score')).toHaveAccessibleName(
      `${assessment.questions.length - 1} of ${assessment.questions.length} correct`,
    );
    await expect(
      completion.getByRole('button', { name: '✓ Completed', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await card
      .getByRole('button', { name: 'Revisit missed ideas', exact: true })
      .click();
    await expect(quiz.getByRole('heading', { level: 3 })).toHaveText(
      assessment.questions[0].prompt,
    );
    await quiz
      .getByRole('button', { name: 'Back to result', exact: true })
      .click();
    await card.getByRole('button', { name: 'Try again', exact: true }).click();
    await expect(quiz.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
    await expect(quiz.getByRole('radio')).toHaveCount(
      assessment.questions[0].choices.length,
    );
    await page.keyboard.press('Escape');
    await completion
      .getByRole('button', { name: '✓ Completed', exact: true })
      .click();
    await expect(
      completion.getByRole('button', {
        name: 'Mark lesson complete',
        exact: true,
      }),
    ).toHaveAttribute('aria-pressed', 'false');
  });
}

test('all three quantum notebooks show every original cell, vertical saved outputs, and byte-identical downloads', async ({
  page,
}) => {
  await page.goto('./#quantum-code');
  const catalogResponse = await page.request.get(
    './notebooks/quantum-catalog.json',
  );
  expect(catalogResponse.ok()).toBe(true);
  const catalog = await catalogResponse.json();
  expect(catalog.moduleId).toBe('quantum');
  expect(catalog.notebooks).toHaveLength(3);
  for (const entry of catalog.notebooks) {
    await page
      .getByRole('tab', {
        name: new RegExp(entry.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      })
      .click();
    const viewer = page.getByTestId('notebook-viewer');
    await expect(viewer).toHaveCount(1);
    await expect(viewer.getByTestId('notebook-reader')).toBeVisible();
    const original = await readFile(entry.path, 'utf8');
    const served = await page.request.get(`./${entry.path}`);
    expect(await served.text()).toBe(original);
    const notebook = JSON.parse(original);
    const cells = notebook.cells.filter(
      (cell: { cell_type: string }) => cell.cell_type === 'code',
    );
    await expect(viewer.getByTestId('notebook-code-cell')).toHaveCount(
      cells.length,
    );
    for (const [index, saved] of cells.entries()) {
      expect(saved.execution_count).toBeGreaterThan(0);
      expect(
        saved.outputs.some(
          (output: { output_type: string }) => output.output_type === 'error',
        ),
      ).toBe(false);
      const cell = viewer.getByTestId('notebook-code-cell').nth(index);
      await expect(
        cell.getByLabel(`Python code cell ${index + 1}`, { exact: true }),
      ).toHaveText(
        Array.isArray(saved.source) ? saved.source.join('') : saved.source,
      );
      const boxes = await cell.evaluate((element) => {
        const code = element
          .querySelector('.notebook-cell-code')!
          .getBoundingClientRect();
        const output = element
          .querySelector('.notebook-cell-output')!
          .getBoundingClientRect();
        return {
          codeBottom: code.bottom,
          outputTop: output.top,
          codeLeft: code.left,
          codeRight: code.right,
          outputLeft: output.left,
          outputRight: output.right,
        };
      });
      expect(boxes.outputTop).toBeGreaterThanOrEqual(boxes.codeBottom);
      expect(boxes.outputLeft).toBeGreaterThanOrEqual(boxes.codeLeft);
      expect(boxes.outputRight).toBeLessThanOrEqual(boxes.codeRight);
      for (const pre of await cell.locator('pre').all())
        expect(
          await pre.evaluate(
            (element) => element.scrollHeight <= element.clientHeight + 1,
          ),
        ).toBe(true);
    }
    const downloaded = page.waitForEvent('download');
    await viewer.getByRole('link', { name: 'Download .ipynb' }).click();
    const download = await downloaded;
    expect(download.suggestedFilename()).toBe(entry.filename);
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    expect(Buffer.concat(chunks).toString('utf8')).toBe(original);
    await expect(viewer.locator('details')).toHaveCount(0);
    await expect(viewer.getByRole('tab')).toHaveCount(0);
    await expect(viewer.getByRole('alert')).toHaveCount(0);
    await expectEnglishLesson(page);
  }
});

test('quantum pages and focused supplements fit 320 pixels in both themes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  for (const theme of ['light', 'dark']) {
    for (const lesson of quantumLessons) {
      await page.goto(`./#${lesson.id}`);
      if ((await page.locator('html').getAttribute('data-theme')) !== theme)
        await page
          .getByRole('button', { name: `Switch to ${theme} mode`, exact: true })
          .click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expectEnglishLesson(page);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
      for (const trigger of [
        page
          .getByTestId('practice-deck')
          .getByRole('button', { name: 'Compare with the explanation' }),
        page.getByRole('button', { name: 'Explore the math', exact: false }),
        page.locator('.lesson-references').getByRole('button'),
      ]) {
        await trigger.click();
        const dialog = page.locator('.focus-dialog[open]');
        await expect(dialog).toHaveCount(1);
        const box = await dialog.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(320);
        expect(box!.y + box!.height).toBeLessThanOrEqual(760);
        await page.keyboard.press('Escape');
        await expect(trigger).toBeFocused();
      }
    }
    await page.goto('./#quantum-code');
    await expect(page.getByTestId('notebook-reader')).toBeVisible();
    const tabs = page
      .getByRole('tablist', { name: 'Notebook series' })
      .getByRole('tab');
    for (const tab of await tabs.all()) {
      await tab.click();
      await expect(page.getByTestId('notebook-reader')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    }
    await tabs.first().focus();
    await page.keyboard.press('End');
    await expect(tabs.last()).toBeFocused();
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    const chart = page
      .getByRole('button', { name: /Enlarge chart from cell/ })
      .first();
    await chart.click();
    const dialog = page.getByRole('dialog', {
      name: 'Enlarged saved notebook chart',
    });
    await expect(dialog).toBeVisible();
    await dialog
      .getByRole('button', { name: 'Fit width', exact: true })
      .click();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    await page.keyboard.press('Escape');
    await expect(chart).toBeFocused();
  }
});
