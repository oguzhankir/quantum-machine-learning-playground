import { expect, test, type Page } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

const pixel =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/1v8AAAAASUVORK5CYII=';
const fixture = {
  nbformat: 4,
  nbformat_minor: 5,
  metadata: { language_info: { name: 'python' } },
  cells: [
    {
      cell_type: 'markdown',
      source:
        '## Read a result\nAn amplitude can have a phase. <img src=x onerror="window.notebookUnsafe=true">',
    },
    {
      cell_type: 'code',
      source: [
        'import numpy as np\n',
        'p = np.abs([1j, 0]) ** 2\n',
        'print(p)\n',
      ],
      execution_count: 1,
      outputs: [
        { output_type: 'stream', text: ['[1. ', '0.]\n'] },
        {
          output_type: 'display_data',
          data: { 'image/png': pixel },
          metadata: { alt: 'A saved probability chart' },
        },
      ],
    },
    {
      cell_type: 'markdown',
      source: '## Try the calculation\nPredict before changing the code.',
    },
    {
      cell_type: 'code',
      source: 'print("<script>unsafe()</script>")',
      execution_count: 2,
      outputs: [
        {
          output_type: 'display_data',
          data: { 'text/html': '<script>window.notebookUnsafe=true</script>' },
        },
      ],
    },
  ],
};

async function mockNotebook(page: Page) {
  await page.route('**/notebooks/catalog.json', (route) =>
    route.fulfill({
      json: {
        version: 1,
        moduleId: 'intuition',
        notebooks: [
          {
            id: 'test',
            title: 'A worked notebook',
            description: 'Saved calculations, not browser execution.',
            path: 'notebooks/build-your-intuition/test.ipynb',
          },
        ],
      },
    }),
  );
  await page.route('**/notebooks/build-your-intuition/test.ipynb', (route) =>
    route.fulfill({ json: fixture }),
  );
  await page.goto('./#intuition-code');
  await expect(page.getByTestId('notebook-reader')).toBeVisible();
}

test('shows exact code and saved output one section at a time with safe rendering and accessible chart zoom', async ({
  page,
}) => {
  await mockNotebook(page);
  const reader = page.getByTestId('notebook-reader');
  await expect(
    reader.getByRole('heading', { name: 'Read a result', exact: true }),
  ).toBeVisible();
  await expect(
    reader.getByRole('heading', { name: 'Try the calculation', exact: true }),
  ).toHaveCount(0);
  await expect(reader.getByLabel('Python code cell 1')).toHaveText(
    Array.isArray(fixture.cells[1].source)
      ? fixture.cells[1].source.join('')
      : fixture.cells[1].source,
  );
  const outputTab = reader.getByRole('tab', {
    name: 'Saved output',
    exact: true,
  });
  if (await outputTab.isVisible()) {
    await reader.getByRole('tab', { name: 'Code', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(outputTab).toHaveAttribute('aria-selected', 'true');
    await expect(reader.getByLabel('Python code cell 1')).not.toBeVisible();
  }
  await expect(reader.getByLabel('Text output from cell 1')).toHaveText(
    '[1. 0.]',
  );
  expect(await page.evaluate(() => 'notebookUnsafe' in window)).toBe(false);
  expect(await reader.locator('script').count()).toBe(0);
  const zoom = reader.getByRole('button', {
    name: 'Enlarge chart from cell 1',
  });
  await zoom.click();
  await expect(
    page.getByRole('dialog', { name: 'Enlarged saved notebook chart' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(zoom).toBeFocused();
  await reader.getByRole('button', { name: 'Next section' }).click();
  await expect(
    reader.getByRole('heading', { name: 'Try the calculation', exact: true }),
  ).toBeFocused();
  if (
    await reader
      .getByRole('tab', { name: 'Saved output', exact: true })
      .isVisible()
  )
    await reader
      .getByRole('tab', { name: 'Saved output', exact: true })
      .click();
  await expect(
    reader.getByText(
      'This saved output format is not supported by the reader.',
      { exact: false },
    ),
  ).toBeVisible();
  expect(
    await reader
      .getByRole('heading', { name: 'Try the calculation', exact: true })
      .evaluate((element) => element.getBoundingClientRect().top),
  ).toBeGreaterThan(40);
  expect(await page.evaluate(() => 'notebookUnsafe' in window)).toBe(false);
});

test('recovers from invalid notebook data without displaying the whole file or blocking download', async ({
  page,
}) => {
  await mockNotebook(page);
  await page.route('**/notebooks/build-your-intuition/test.ipynb', (route) =>
    route.fulfill({ body: '{invalid', contentType: 'application/json' }),
  );
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('not valid JSON');
  await expect(
    page.getByRole('link', { name: 'Download .ipynb' }),
  ).toHaveAttribute('download', 'test.ipynb');
  await page.unroute('**/notebooks/build-your-intuition/test.ipynb');
  await page.route('**/notebooks/build-your-intuition/test.ipynb', (route) =>
    route.fulfill({ json: fixture }),
  );
  await page.getByRole('button', { name: 'Try loading again' }).click();
  await expect(page.getByTestId('notebook-reader')).toBeVisible();
});

test('actual notebook series exposes executed original downloads and finite section navigation', async ({
  page,
}) => {
  await page.goto('./#intuition-code');
  const catalogResponse = await page.request.get('./notebooks/catalog.json');
  expect(catalogResponse.ok()).toBe(true);
  const catalog = await catalogResponse.json();
  expect(catalog.notebooks).toHaveLength(3);
  for (const entry of catalog.notebooks) {
    await page
      .getByRole('tab', {
        name: new RegExp(entry.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      })
      .click();
    const viewer = page.getByTestId('notebook-viewer');
    await expect(viewer.getByTestId('notebook-reader')).toBeVisible();
    const response = await page.request.get(`./${entry.path}`);
    expect(response.ok()).toBe(true);
    const saved = await response.json();
    const cells = saved.cells.filter(
      (cell: { cell_type: string }) => cell.cell_type === 'code',
    );
    expect(cells.length).toBeGreaterThan(0);
    expect(
      cells.every(
        (cell: { execution_count: number }) => cell.execution_count > 0,
      ),
    ).toBe(true);
    await expect(
      viewer.getByText(new RegExp(`${cells.length} executed code cells`)),
    ).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await viewer.getByRole('link', { name: 'Download .ipynb' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(entry.filename);
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    expect(JSON.parse(Buffer.concat(chunks).toString())).toEqual(saved);
    await expect(viewer.locator('details')).toHaveCount(0);
    await viewer.getByRole('button', { name: 'Next section' }).click();
    await expect(viewer.getByTestId('notebook-code-cell')).toHaveCount(1);
  }
});

test('notebook reader remains bounded and readable in both themes on a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await mockNotebook(page);
  for (const theme of ['light', 'dark']) {
    await page.evaluate(
      (value) => document.documentElement.setAttribute('data-theme', value),
      theme,
    );
    await expect(
      page.getByRole('link', { name: 'Download .ipynb' }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    const colors = await page
      .getByRole('link', { name: 'Download .ipynb' })
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return { text: style.color, background: style.backgroundColor };
      });
    const luminance = (color: string) => {
      const channels = color
        .match(/\d+/g)!
        .slice(0, 3)
        .map((value) => {
          const channel = Number(value) / 255;
          return channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
        });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const text = luminance(colors.text);
    const background = luminance(colors.background);
    expect(
      (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05),
    ).toBeGreaterThanOrEqual(4.5);
  }
});
