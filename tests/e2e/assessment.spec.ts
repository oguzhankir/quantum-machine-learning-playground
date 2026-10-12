import { expect, test } from '@playwright/test';
import { assessments } from '../../src/lessons/assessments';
import { ASSESSMENT_STORAGE_KEY } from '../../src/lib/learning/assessment';

const quizName = { name: 'Check your understanding', exact: true };

test('the introduction quiz is optional and resumes checked responses in a focused dialog', async ({
  page,
}) => {
  await page.goto('./#why');
  const card = page.getByRole('region', quizName);
  const quiz = page.getByRole('dialog', quizName);
  await expect(quiz).not.toBeVisible();
  await page
    .getByRole('button', { name: 'Mark lesson complete', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: '✓ Completed', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await card
    .getByRole('button', { name: 'Start the quiz', exact: true })
    .click();
  await expect(
    quiz.getByText('Question 1 of 3', { exact: true }),
  ).toBeVisible();
  await expect(quiz.locator('fieldset')).toHaveCount(1);
  await expect(
    quiz.getByRole('button', { name: 'Check answer', exact: true }),
  ).toBeDisabled();
  await quiz.getByRole('radio').nth(0).check();
  await page.reload();
  await expect(quiz).not.toBeVisible();
  await card.getByRole('button', { name: 'Resume quiz', exact: true }).click();
  await expect(quiz.locator('input:checked')).toHaveCount(0);
  await quiz.getByRole('radio').nth(0).check();
  await quiz.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(quiz.getByRole('status')).toContainText('allowed energy levels');
  await expect(quiz.getByRole('radio')).toHaveCount(0);
  await quiz
    .getByRole('button', { name: 'Next question', exact: true })
    .click();
  await expect(
    quiz.getByText('Question 2 of 3', { exact: true }),
  ).toBeVisible();
  await quiz.getByRole('button', { name: 'Pause quiz', exact: true }).click();
  await expect(quiz).not.toBeVisible();
  await expect(
    card.getByRole('button', { name: 'Resume quiz', exact: true }),
  ).toBeFocused();
  await page.reload();
  await card.getByRole('button', { name: 'Resume quiz', exact: true }).click();
  await expect(
    quiz.getByText('Question 2 of 3', { exact: true }),
  ).toBeVisible();
  await quiz
    .getByRole('button', { name: 'Previous question', exact: true })
    .click();
  await expect(quiz.locator('.assessment-your-answer')).toContainText(
    assessments.why.questions[0].choices[0].text,
  );
  await expect(quiz.getByRole('radio')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: '✓ Completed', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('the waves exam checks every question and reviews missed reasoning one idea at a time', async ({
  page,
}) => {
  await page.goto('./#waves');
  const card = page.getByRole('region', quizName);
  const quiz = page.getByRole('dialog', quizName);
  await card
    .getByRole('button', { name: 'Start the quiz', exact: true })
    .click();
  for (const [index, question] of assessments.waves.questions.entries()) {
    await expect(
      quiz.getByText(
        `Question ${index + 1} of ${assessments.waves.questions.length}`,
        { exact: true },
      ),
    ).toBeVisible();
    await expect(quiz.locator('fieldset')).toHaveCount(1);
    await expect(quiz.getByRole('group')).toHaveAccessibleName(question.prompt);
    await quiz
      .getByRole('radio')
      .nth(index === 0 ? 1 : question.correct)
      .check();
    await quiz
      .getByRole('button', { name: 'Check answer', exact: true })
      .click();
    await expect(quiz.getByRole('status')).toBeVisible();
    await expect(quiz.getByRole('radio')).toHaveCount(0);
    await quiz
      .getByRole('button', {
        name:
          index === assessments.waves.questions.length - 1
            ? 'See my result'
            : 'Next question',
        exact: true,
      })
      .click();
  }
  await expect(quiz).not.toBeVisible();
  await expect(card.locator('.assessment-score')).toHaveAccessibleName(
    '7 of 8 correct',
  );
  await expect(
    page.getByRole('button', { name: 'Mark lesson complete', exact: true }),
  ).toBeVisible();
  await card
    .getByRole('button', { name: 'Revisit missed ideas', exact: true })
    .click();
  await expect(quiz.getByRole('heading', { level: 3 })).toHaveText(
    assessments.waves.questions[0].prompt,
  );
  await expect(quiz.getByRole('status')).toContainText('negative displacement');
  await quiz
    .getByRole('button', { name: 'Back to result', exact: true })
    .click();
  await expect(
    card.getByRole('button', { name: 'Revisit missed ideas', exact: true }),
  ).toBeFocused();
  await page.reload();
  await expect(card.locator('.assessment-score')).toHaveAccessibleName(
    '7 of 8 correct',
  );
  await card.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(
    quiz.getByText('Question 1 of 8', { exact: true }),
  ).toBeVisible();
  await expect(quiz.locator('input:checked')).toHaveCount(0);
  await expect(quiz.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '0',
  );
});

test('quiz choices and controls remain readable in both themes and fit a narrow screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('./#waves');
  const quiz = page.getByRole('dialog', quizName);
  await page
    .getByRole('region', quizName)
    .getByRole('button', { name: 'Start the quiz', exact: true })
    .click();
  for (const theme of ['light', 'dark']) {
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    await quiz.getByRole('radio').nth(1).check();
    for (const selector of [
      '.assessment-choice.is-selected',
      '.assessment-primary:not(:disabled)',
    ]) {
      const contrast = await quiz.locator(selector).evaluate((element) => {
        const styles = getComputedStyle(element);
        const luminance = (color: string) => {
          const channels = color
            .match(/[\d.]+/g)!
            .slice(0, 3)
            .map(Number)
            .map((value) => {
              const linear = value / 255;
              return linear <= 0.04045
                ? linear / 12.92
                : ((linear + 0.055) / 1.055) ** 2.4;
            });
          return (
            channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
          );
        };
        const foreground = luminance(styles.color);
        const background = luminance(styles.backgroundColor);
        return (
          (Math.max(foreground, background) + 0.05) /
          (Math.min(foreground, background) + 0.05)
        );
      });
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await quiz.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(quiz.getByRole('status')).toBeVisible();
  const footer = await quiz.locator('.assessment-dialog-footer').boundingBox();
  expect((footer?.y ?? 0) + (footer?.height ?? 0)).toBeLessThanOrEqual(900);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('the modal leaves the lesson height unchanged and Escape returns focus without losing checked answers', async ({
  page,
}) => {
  await page.goto('./#waves');
  const card = page.getByRole('region', quizName);
  const quiz = page.getByRole('dialog', quizName);
  const before = await page
    .locator('.lesson-section')
    .evaluate((element) => element.scrollHeight);
  await card
    .getByRole('button', { name: 'Start the quiz', exact: true })
    .click();
  await expect(quiz).toBeVisible();
  await quiz.getByRole('radio').nth(0).check();
  await quiz.getByRole('button', { name: 'Check answer', exact: true }).click();
  const after = await page
    .locator('.lesson-section')
    .evaluate((element) => element.scrollHeight);
  expect(after).toBe(before);
  await page.keyboard.press('Escape');
  await expect(quiz).not.toBeVisible();
  await expect(
    card.getByRole('button', { name: 'Resume quiz', exact: true }),
  ).toBeFocused();
  await card.getByRole('button', { name: 'Resume quiz', exact: true }).click();
  await expect(quiz.locator('.assessment-your-answer')).toContainText(
    assessments.waves.questions[0].choices[0].text,
  );
  await expect(quiz.getByRole('radio')).toHaveCount(0);
});

test('resetting learning progress resets both quizzes and preserves the theme', async ({
  page,
}) => {
  await page.addInitScript((key) => {
    localStorage.setItem('quantum-ml-playground:theme:v1', 'dark');
    localStorage.setItem(
      `${key}:waves`,
      JSON.stringify({
        started: true,
        index: 0,
        answers: {},
        completed: false,
      }),
    );
  }, ASSESSMENT_STORAGE_KEY);
  await page.goto('./#why');
  const quiz = page.getByRole('dialog', quizName);
  await page
    .getByRole('region', quizName)
    .getByRole('button', { name: 'Start the quiz', exact: true })
    .click();
  await quiz.getByRole('radio').nth(0).check();
  await quiz.getByRole('button', { name: 'Check answer', exact: true }).click();
  await quiz.getByRole('button', { name: 'Pause quiz', exact: true }).click();
  const menu = page.getByRole('button', {
    name: 'Open lesson menu',
    exact: true,
  });
  if (await menu.isVisible()) await menu.click();
  await page
    .getByRole('button', { name: 'Reset progress', exact: true })
    .click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const stored = await page.evaluate(
    (key) => [
      localStorage.getItem(`${key}:why`),
      localStorage.getItem(`${key}:waves`),
    ],
    ASSESSMENT_STORAGE_KEY,
  );
  expect(stored).toEqual([null, null]);
});
