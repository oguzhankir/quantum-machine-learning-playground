import { test, expect, type Locator } from '@playwright/test';

/** Inspect the rendered colors, including nested labels and transparent
 * backgrounds. Checking theme names alone cannot catch a pale hover surface
 * combined with dark-theme text. */
async function expectReadableControl(control: Locator) {
  const failures = await control.evaluate((button) => {
    const color = (value: string) => {
      const values = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
      return [values[0], values[1], values[2], values[3] ?? 1];
    };
    const over = (front: number[], back: number[]) => {
      const alpha = front[3] + back[3] * (1 - front[3]);
      return [
        ...front
          .slice(0, 3)
          .map((value, index) =>
            alpha
              ? (value * front[3] + back[index] * back[3] * (1 - front[3])) /
                alpha
              : 0,
          ),
        alpha,
      ];
    };
    const background = (element: Element | null): number[] => {
      if (!element) return [255, 255, 255, 1];
      return over(
        color(getComputedStyle(element).backgroundColor),
        background(element.parentElement),
      );
    };
    const luminance = (values: number[]) =>
      values
        .slice(0, 3)
        .map((value) => value / 255)
        .map((value) =>
          value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
        )
        .reduce(
          (total, value, index) =>
            total + value * [0.2126, 0.7152, 0.0722][index],
          0,
        );
    const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
    const result: { text: string; ratio: number }[] = [];
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      const element = text.parentElement;
      if (!element || !text.textContent?.trim()) continue;
      const style = getComputedStyle(element);
      if (!element.getClientRects().length || style.visibility === 'hidden')
        continue;
      let opacity = 1;
      for (
        let ancestor: Element | null = element;
        ancestor;
        ancestor = ancestor.parentElement
      )
        opacity *= Number(getComputedStyle(ancestor).opacity);
      const bg = background(element);
      const fg = color(style.color);
      fg[3] *= opacity;
      const first = luminance(over(fg, bg));
      const second = luminance(bg);
      const ratio =
        (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
      if (ratio < 4.5) result.push({ text: text.textContent.trim(), ratio });
    }
    return result;
  });
  expect(failures).toEqual([]);
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} controls retain readable text through normal, hover, focus and selected states`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    for (const route of ['why', 'waves', 'gates']) {
      await page.goto(`./#${route}`);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const controls = page.locator('button:visible');
      for (let index = 0; index < (await controls.count()); index++) {
        const control = controls.nth(index);
        await expectReadableControl(control);
        await control.hover();
        await expectReadableControl(control);
        if (await control.isEnabled()) {
          await page.keyboard.press('Tab');
          await control.focus();
          await expectReadableControl(control);
        }
      }
    }

    await page.goto('./#waves');
    const presets = page.locator('.wave-phase-presets button');
    for (let index = 0; index < (await presets.count()); index++) {
      const preset = presets.nth(index);
      await preset.click();
      await expect(preset).toHaveAttribute('aria-pressed', 'true');
      await preset.hover();
      await expectReadableControl(preset);
      await page.keyboard.press('Tab');
      await preset.focus();
      await expectReadableControl(preset);
    }

    const lab = page.getByRole('region', {
      name: 'Wave and interference laboratory',
    });
    const selected = lab.getByRole('button', {
      name: 'Opposite phase · 180°',
      exact: true,
    });
    await selected.click();
    await expect(selected).toHaveAttribute('aria-pressed', 'true');
    await selected.hover();
    await expectReadableControl(selected);
    const disabled = lab.getByRole('button', {
      name: 'Clear detections',
      exact: true,
    });
    await expect(disabled).toBeDisabled();
    await expectReadableControl(disabled);
  });
}

test('the compact navigator follows settled scrolling with calculated anchor offsets', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#waves');
  const navigator = page.getByRole('navigation', { name: 'Lesson sections' });
  for (const label of ['Experiment', 'Self-check', 'Understand']) {
    const tab = navigator.getByRole('button', { name: label, exact: true });
    await tab.click();
    // Wait beyond the scroll event and its animation-frame state update so
    // the immediate click state cannot mask a broken scroll calculation.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
    await expect(tab).toHaveAttribute('aria-current', 'step');
    await expect(navigator).toBeInViewport();
  }
});
