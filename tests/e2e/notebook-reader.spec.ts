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

test('reads every section continuously with saved outputs below exact code and safe chart inspection', async ({
  page,
}) => {
  await mockNotebook(page);
  const reader = page.getByTestId('notebook-reader');
  await expect(
    reader.getByRole('heading', { name: 'Read a result', exact: true }),
  ).toBeVisible();
  await expect(
    reader.getByRole('heading', { name: 'Try the calculation', exact: true }),
  ).toBeVisible();
  await expect(reader.getByTestId('notebook-section')).toHaveCount(2);
  await expect(reader.getByTestId('notebook-code-cell')).toHaveCount(2);
  await expect(reader.locator('article')).toHaveCount(1);
  await expect(reader.getByLabel('Python code cell 1')).toHaveText(
    Array.isArray(fixture.cells[1].source)
      ? fixture.cells[1].source.join('')
      : fixture.cells[1].source,
  );
  await expect(reader.getByRole('tab')).toHaveCount(0);
  await expect(
    reader.getByRole('button', { name: 'Next section' }),
  ).toHaveCount(0);
  await expect(reader.getByLabel('Text output from cell 1')).toHaveText(
    '[1. 0.]',
  );
  await expect(reader.getByLabel('Text output from cell 1')).toBeVisible();
  await expect(reader.getByLabel('Python code cell 2')).toHaveText(
    fixture.cells[3].source as string,
  );
  await expect(
    reader.getByText(
      'This saved output format is not supported by the reader.',
      { exact: false },
    ),
  ).toBeVisible();
  const code = await reader.getByLabel('Python code cell 1').boundingBox();
  const output = await reader
    .getByLabel('Text output from cell 1')
    .boundingBox();
  const nextHeading = await reader
    .getByRole('heading', { name: 'Try the calculation', exact: true })
    .boundingBox();
  expect(code).not.toBeNull();
  expect(output).not.toBeNull();
  expect(nextHeading).not.toBeNull();
  expect(output!.y).toBeGreaterThanOrEqual(code!.y + code!.height);
  expect(nextHeading!.y).toBeGreaterThan(output!.y + output!.height);
  expect(await page.evaluate(() => 'notebookUnsafe' in window)).toBe(false);
  expect(await reader.locator('script').count()).toBe(0);
  await expect(reader.locator('img')).toHaveCount(1);
  const zoom = reader.getByRole('button', {
    name: 'Enlarge chart from cell 1',
  });
  await zoom.click();
  await expect(
    page.getByRole('dialog', { name: 'Enlarged saved notebook chart' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Fit width', exact: true }).click();
  await expect(
    page.getByRole('region', {
      name: 'Chart fitted to the available width',
    }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Original size', exact: true })
    .click();
  await expect(
    page.getByRole('region', {
      name: 'Chart at original resolution; scroll to see all labels',
    }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(zoom).toBeFocused();
});

test('outline jumps focus headings without replacing cells and follows ordinary scrolling', async ({
  page,
}) => {
  await mockNotebook(page);
  const reader = page.getByTestId('notebook-reader');
  const outline = reader.getByRole('navigation', { name: 'Notebook sections' });
  const firstHeading = reader.getByRole('heading', {
    name: 'Read a result',
    exact: true,
  });
  const nextHeading = reader.getByRole('heading', {
    name: 'Try the calculation',
    exact: true,
  });
  const originalCell = await reader
    .getByTestId('notebook-code-cell')
    .first()
    .elementHandle();
  await outline.getByRole('button', { name: /Try the calculation/ }).click();
  await expect(nextHeading).toBeFocused();
  await expect(outline.locator('[aria-current]')).toContainText(
    'Try the calculation',
  );
  await expect(firstHeading).toBeVisible();
  await expect(reader.getByTestId('notebook-code-cell')).toHaveCount(2);
  expect(await originalCell!.evaluate((element) => element.isConnected)).toBe(
    true,
  );
  expect(
    await nextHeading.evaluate(
      (element) => element.getBoundingClientRect().top,
    ),
  ).toBeGreaterThan(40);
  // A reader can also scroll normally; the outline must describe that location.
  await firstHeading.evaluate((element) =>
    element.scrollIntoView({ block: 'start', behavior: 'instant' }),
  );
  await expect(outline.locator('[aria-current]')).toContainText(
    'Read a result',
  );
  await nextHeading.evaluate((element) =>
    element.scrollIntoView({ block: 'start', behavior: 'instant' }),
  );
  await expect(outline.locator('[aria-current]')).toContainText(
    'Try the calculation',
  );
  await outline.getByRole('button', { name: /Read a result/ }).focus();
  await page.keyboard.press('End');
  await expect(
    outline.getByRole('button', { name: /Try the calculation/ }),
  ).toBeFocused();
  await page.keyboard.press('Home');
  await expect(
    outline.getByRole('button', { name: /Read a result/ }),
  ).toBeFocused();
  await expect(outline.locator('[aria-current]')).toContainText(
    'Read a result',
  );
  await reader.getByRole('button', { name: 'Back to beginning' }).click();
  await expect(firstHeading).toBeFocused();
  await expect(reader.getByTestId('notebook-code-cell')).toHaveCount(2);
});

test('copies the exact notebook source and selects it when clipboard access is denied', async ({
  page,
}) => {
  await mockNotebook(page);
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.copiedNotebookCode = text;
        },
      },
    });
  });
  const cell = page.getByTestId('notebook-code-cell').first();
  const source = (fixture.cells[1].source as string[]).join('');
  await cell.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(cell.getByRole('status')).toHaveText('Code copied.');
  expect(
    await page.evaluate(
      () => document.documentElement.dataset.copiedNotebookCode,
    ),
  ).toBe(source);
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
  await cell.getByRole('button', { name: 'Copy code', exact: true }).click();
  await expect(cell.getByRole('status')).toHaveText(
    'Code selected. Press Ctrl+C or Command+C to copy.',
  );
  const selection = await page.evaluate(() => {
    const selected = window.getSelection();
    return {
      source: selected?.rangeCount
        ? selected.getRangeAt(0).toString()
        : undefined,
      rendered: selected?.toString(),
    };
  });
  expect(selection.source).toBe(source);
  // Chromium can omit the final rendered line break from Selection text.
  expect(selection.rendered?.replace(/\n$/, '')).toBe(
    source.replace(/\n$/, ''),
  );
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

test('one notebook at a time exposes every executed cell and downloads the unchanged original', async ({
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
    await expect(viewer).toHaveCount(1);
    await expect(viewer.getByTestId('notebook-reader')).toBeVisible();
    const response = await page.request.get(`./${entry.path}`);
    expect(response.ok()).toBe(true);
    const savedText = await response.text();
    const saved = JSON.parse(savedText);
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
    await expect(viewer.getByTestId('notebook-code-cell')).toHaveCount(
      cells.length,
    );
    for (let index = 0; index < cells.length; index += 1) {
      const source = Array.isArray(cells[index].source)
        ? cells[index].source.join('')
        : cells[index].source;
      await expect(
        viewer.getByLabel(`Python code cell ${index + 1}`, { exact: true }),
      ).toHaveText(source);
    }
    const downloadPromise = page.waitForEvent('download');
    await viewer.getByRole('link', { name: 'Download .ipynb' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(entry.filename);
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    expect(Buffer.concat(chunks).toString()).toBe(savedText);
    await expect(viewer.locator('details')).toHaveCount(0);
    await expect(viewer.getByRole('tab')).toHaveCount(0);
  }
});

test('continuous code and outputs remain readable in both themes at 320 pixels', async ({
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
    await expect(page.getByLabel('Python code cell 1')).toBeVisible();
    await expect(page.getByLabel('Text output from cell 1')).toBeVisible();
    await expect(page.getByLabel('Python code cell 2')).toBeVisible();
    await expect(
      page.getByTestId('notebook-reader').getByRole('tab'),
    ).toHaveCount(0);
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
