import {
  test as base,
  expect,
  type Locator,
  type Page,
} from '@playwright/test';
import {
  physicsHistory,
  qmlHistory,
  researchDirections,
  researchSnapshot,
} from '../../src/content/history';

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

async function expectReadablePage(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(
    /[ıİşŞğĞ]|\b(?:dersler|kavram|merhaba|kuantum|deney|genlik|araştırmalar|zaman çizelgesi)\b/i,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
  await expect(page.locator('.katex-error')).toHaveCount(0);
}

async function expandDisclosure(detail: Locator, label: string) {
  const panel = detail.locator('details').filter({
    has: detail.page().locator('summary').filter({ hasText: label }),
  });
  if ((await panel.getAttribute('open')) === null) {
    await panel.locator('summary').click();
  }
  return panel;
}

test('history deep links retain the selected milestone across reload and browser history', async ({
  page,
}) => {
  const physics = physicsHistory[0];
  const qml = qmlHistory[0];
  await page.goto(`./#history?track=physics&event=${physics.id}`);
  await expect(
    page.getByTestId('milestone-detail').getByRole('heading', {
      name: physics.title,
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('milestone-detail')).toContainText(
    physics.title,
  );
  await page
    .getByRole('navigation', { name: 'History tracks' })
    .getByRole('link', { name: /Quantum machine learning/ })
    .click();
  await expect(page).toHaveURL(/#history\?track=qml/);
  await expect(page.getByTestId('milestone-detail')).toContainText(qml.title);
  await page.goBack();
  await expect(page).toHaveURL(
    new RegExp(`#history\\?track=physics&event=${physics.id}$`),
  );
  await expect(page.getByTestId('milestone-detail')).toContainText(
    physics.title,
  );
  await page.goForward();
  await expect(page).toHaveURL(/#history\?track=qml/);
  await expect(page.getByTestId('milestone-detail')).toContainText(qml.title);
});

test('timeline search and era filters preserve an understandable empty state', async ({
  page,
}) => {
  await page.goto('./#history?track=physics');
  const navigation = page.getByRole('navigation', {
    name: 'Historical milestones',
  });
  const search = page.getByLabel('Search milestones', { exact: true });
  const eraFilter = page.getByRole('combobox', { name: 'Filter timeline era' });
  const selected = physicsHistory[2];
  await eraFilter.selectOption({ label: selected.era });
  await expect(navigation.getByRole('link')).toHaveCount(
    physicsHistory.filter(({ era }) => era === selected.era).length,
  );
  await eraFilter.selectOption({ index: 0 });
  await search.fill(selected.title);
  await expect(navigation.getByRole('link')).toHaveCount(1);
  await navigation.getByRole('link').click();
  await expect(page.getByTestId('milestone-detail')).toContainText(
    selected.title,
  );
  await expect(page.locator('#history-detail-heading')).toBeInViewport();
  await search.fill('no-milestone-matches-this-query');
  await expect(navigation.getByRole('link')).toHaveCount(0);
  await search.fill('');
  await expect(navigation.getByRole('link')).toHaveCount(physicsHistory.length);
  await expectReadablePage(page);
});

test('milestone details explain concepts, expose original literature, and continue into a lesson', async ({
  page,
}, testInfo) => {
  const event =
    qmlHistory.find(({ formulas }) => formulas?.length) ?? qmlHistory[0];
  await page.goto(`./#history?track=qml&event=${event.id}`);
  const detail = page.getByTestId('milestone-detail');
  if (testInfo.project.name === 'mobile') {
    await detail
      .getByRole('button', { name: 'Enlarge diagram', exact: true })
      .click();
    const diagram = detail.getByRole('region', {
      name: 'Enlarged diagram. Scroll horizontally to read the labels.',
      exact: true,
    });
    await expect(diagram).toBeVisible();
    expect(
      await diagram.evaluate((node) => node.scrollWidth > node.clientWidth),
    ).toBe(true);
    await diagram.evaluate((node) => {
      node.scrollLeft = node.scrollWidth;
    });
    expect(await diagram.evaluate((node) => node.scrollLeft)).toBeGreaterThan(
      0,
    );
    await expectReadablePage(page);
    await detail
      .getByRole('button', { name: 'Fit diagram', exact: true })
      .click();
    expect(
      await detail
        .locator('.milestone-diagram-viewport')
        .evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
    ).toBe(true);
  }
  await detail.getByText('Read the explanation', { exact: true }).click();
  for (const paragraph of event.answer)
    await expect(detail.getByText(paragraph, { exact: true })).toBeVisible();
  await detail.getByText('Explore the concepts', { exact: true }).click();
  for (const concept of event.concepts)
    await expect(
      detail.getByText(concept.meaning, { exact: true }),
    ).toBeVisible();
  if (event.formulas?.length)
    await expect(detail.locator('.katex')).not.toHaveCount(0);
  await detail.getByText('Read the research', { exact: true }).click();
  for (const source of event.sources) {
    await expect(detail.locator(`a[href="${source.url}"]`)).toBeVisible();
  }
  await expectReadablePage(page);
  await detail.locator(`a[href="#${event.lessons[0]}"]`).click();
  await expect(page).toHaveURL(new RegExp(`#${event.lessons[0]}$`));
  await expect(page.locator('.lesson-section #page-heading')).toBeVisible();
});

test('every history visualization is readable on the production Pages subpath', async ({
  page,
}) => {
  for (const event of [...physicsHistory, ...qmlHistory]) {
    await page.goto(`./#history?track=${event.track}&event=${event.id}`);
    const detail = page.getByTestId('milestone-detail');
    await expect(
      detail.getByRole('heading', { name: event.title, exact: true }),
    ).toBeVisible();
    const trackEvents = event.track === 'physics' ? physicsHistory : qmlHistory;
    if (event.id === trackEvents[0].id) {
      const renderedOrder = await page
        .getByRole('navigation', { name: 'Historical milestones' })
        .getByRole('link')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      expect(renderedOrder).toEqual(
        trackEvents.map(
          (milestone) =>
            `#history?track=${milestone.track}&event=${encodeURIComponent(milestone.id)}`,
        ),
      );
    }
    await detail.getByText('Read the explanation', { exact: true }).click();
    await detail.getByText('Explore the concepts', { exact: true }).click();
    await detail.getByText('Read the research', { exact: true }).click();
    await expectReadablePage(page);
  }
});

test('the research snapshot states the scope and latest cited evidence year', async ({
  page,
}) => {
  await page.goto('./#research');
  await expect(
    page.getByText(researchSnapshot.scope, { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('main')).toContainText(
    String(researchSnapshot.latestEvidenceYear),
  );
  await expectReadablePage(page);
});

test('research direction deep links retain selection and browser navigation', async ({
  page,
}) => {
  const first = researchDirections[0];
  const second = researchDirections[1];
  await page.goto(`./#research?direction=${first.id}`);
  await expect(
    page.getByTestId('research-detail').getByRole('heading', {
      name: first.title,
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('research-detail')).toContainText(first.title);
  await page.getByTestId(`direction-card-${second.id}`).click();
  await expect(page).toHaveURL(
    new RegExp(`#research\\?direction=${second.id}$`),
  );
  await expect(page.getByTestId('research-detail')).toContainText(second.title);
  await expect(page.locator('#research-detail-heading')).toBeInViewport();
  await page.goBack();
  await expect(page).toHaveURL(
    new RegExp(`#research\\?direction=${first.id}$`),
  );
  await expect(page.getByTestId('research-detail')).toContainText(first.title);
  await page.goForward();
  await expect(page.getByTestId('research-detail')).toContainText(second.title);
});

test('research search and focus filters expose relevant directions and recover from no results', async ({
  page,
}) => {
  await page.goto('./#research');
  const cards = page.locator('[data-testid^="direction-card-"]');
  const focus = page.getByRole('combobox', { name: 'Filter research focus' });
  const input = page.getByRole('combobox', { name: 'Filter research input' });
  const search = page.getByLabel('Search research directions', { exact: true });
  await focus.selectOption('bottleneck');
  await expect(cards).toHaveCount(
    researchDirections.filter(({ signal }) => signal === 'bottleneck').length,
  );
  await focus.selectOption('all');
  await input.selectOption('quantum');
  await expect(cards).toHaveCount(
    researchDirections.filter(({ input: kind }) => kind === 'quantum').length,
  );
  await input.selectOption('all');
  await search.fill(researchDirections[0].title);
  await expect(cards).toHaveCount(1);
  await search.fill('no-research-direction-matches-this-query');
  await expect(cards).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Show all directions', exact: true })
    .click();
  await expect(search).toHaveValue('');
  await expect(cards).toHaveCount(researchDirections.length);
  await expectReadablePage(page);
});

test('each research direction expands evidence, terms, papers, and a practical experiment', async ({
  page,
}) => {
  for (const direction of researchDirections) {
    await page.goto(`./#research?direction=${direction.id}`);
    const detail = page.getByTestId('research-detail');
    await expect(
      detail.getByRole('heading', { name: direction.title, exact: true }),
    ).toBeVisible();
    await expandDisclosure(detail, 'Explore the evidence');
    for (const evidence of direction.evidence)
      await expect(detail.getByText(evidence, { exact: true })).toBeVisible();
    await expandDisclosure(detail, 'Plan an experiment');
    await expect(
      detail.getByText(direction.experiment.deliverable, { exact: true }),
    ).toBeVisible();
    await expandDisclosure(detail, 'Understand the terms');
    for (const concept of direction.concepts)
      await expect(
        detail.getByText(concept.meaning, { exact: true }),
      ).toBeVisible();
    const papers = await expandDisclosure(detail, 'Read the papers');
    for (const source of direction.sources)
      await expect(papers.locator(`a[href="${source.url}"]`)).toBeVisible();
    for (const lessonId of direction.prerequisites)
      await expect(detail.locator(`a[href="#${lessonId}"]`)).toBeVisible();
    await expectReadablePage(page);
  }
});
