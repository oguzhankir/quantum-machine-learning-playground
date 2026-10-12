import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('wave measurements show amplitude and wavelength on fixed physical scales', async ({
  page,
}) => {
  await page.goto('./#waves');
  const lesson = page.getByTestId('wave-basics');
  await expect(lesson.getByRole('button', { name: 'Play wave' })).toBeVisible();
  await lesson.getByRole('tab', { name: 'Amplitude', exact: true }).click();
  const curve = lesson.getByTestId('wave-basics-curve');
  const verticalSpan = async () => {
    const points = (await curve.getAttribute('points'))!
      .split(' ')
      .map((point) => Number(point.split(',')[1]));
    return Math.max(...points) - Math.min(...points);
  };
  const initialHeight = await verticalSpan();
  await lesson.getByRole('button', { name: '2 cm', exact: true }).click();
  await expect(lesson.getByRole('status')).toContainText('separation is 4 cm');
  expect(await verticalSpan()).toBeCloseTo(initialHeight * 2, 5);
  await expect(lesson.getByRole('img')).toHaveAccessibleName(
    /Amplitude 2 centimetres, wavelength 4 metres/,
  );
  await expect(lesson.getByText('Horizontal: position (m)')).toBeVisible();

  await lesson.getByRole('tab', { name: 'Wavelength', exact: true }).click();
  await lesson.getByRole('button', { name: '2 m', exact: true }).click();
  await expect(lesson.getByRole('status')).toContainText('2.5 − 0.5 = 2 m');
  await expect(lesson.getByRole('img')).toHaveAccessibleName(
    /Amplitude 1 centimetres, wavelength 2 metres/,
  );
  const waveHeights = (await curve.getAttribute('points'))!
    .split(' ')
    .map((point) => Number(point.split(',')[1]));
  const peaks = waveHeights.filter(
    (height, index) =>
      index > 0 &&
      index < waveHeights.length - 1 &&
      height < waveHeights[index - 1] &&
      height < waveHeights[index + 1],
  );
  expect(peaks).toHaveLength(4);
});

test('frequency uses a time axis and motion keeps the cork at one position', async ({
  page,
}) => {
  await page.goto('./#waves');
  const lesson = page.getByTestId('wave-basics');
  const cork = lesson.getByTestId('wave-basics-cork');
  const initialX = await cork.getAttribute('cx');
  const initialY = await cork.getAttribute('cy');
  await lesson.getByRole('slider', { name: 'Wave time in seconds' }).fill('1');
  await expect(cork).toHaveAttribute('cx', initialX!);
  expect(await cork.getAttribute('cy')).not.toBe(initialY);
  await expect(lesson.getByRole('button', { name: 'Play wave' })).toBeVisible();

  await lesson.getByRole('tab', { name: 'Frequency', exact: true }).click();
  await lesson.getByRole('button', { name: '2 Hz', exact: true }).click();
  await expect(lesson.getByRole('status')).toContainText(
    'One cycle takes 0.5 seconds',
  );
  await expect(lesson.getByRole('status')).toContainText(
    'In 2 seconds, this point completes 4 cycles',
  );
  await expect(lesson.getByText('Horizontal: time (s)')).toBeVisible();
  await expect(lesson.getByRole('img')).toHaveAccessibleName(
    /Displacement versus time at one position. Frequency 2 hertz/,
  );
  await lesson.getByRole('tab', { name: 'Frequency', exact: true }).focus();
  await page.keyboard.press('Home');
  await expect(
    lesson.getByRole('tab', { name: 'Motion', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  await expect(lesson.getByRole('button', { name: 'Play wave' })).toBeVisible();
});

test('wave basics remain readable and fit a narrow screen in dark mode', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('quantum-ml-playground:theme:v1', 'dark');
  });
  await page.goto('./#waves');
  const lesson = page.getByTestId('wave-basics');
  await lesson.getByRole('tab', { name: 'Amplitude', exact: true }).click();
  await lesson.getByRole('button', { name: '3 cm', exact: true }).click();
  const colors = await lesson
    .getByRole('button', { name: '3 cm', exact: true })
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return { text: style.color, background: style.backgroundColor };
    });
  const luminance = (color: string) => {
    const rgb = color.match(/\d+/g)!.slice(0, 3).map(Number);
    const channels = rgb.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const foreground = luminance(colors.text);
  const background = luminance(colors.background);
  expect(
    (Math.max(foreground, background) + 0.05) /
      (Math.min(foreground, background) + 0.05),
  ).toBeGreaterThanOrEqual(4.5);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
});
