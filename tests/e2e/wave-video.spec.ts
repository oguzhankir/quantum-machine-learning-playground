import { test, expect } from '@playwright/test';

test('water clips are optional and never autoplay or continue after closing', async ({
  page,
}) => {
  await page.goto('./#waves');
  const clips = page.locator('.wave-video');
  await expect(clips).toHaveCount(2);
  await expect(clips.locator('video')).toHaveCount(0);
  const motion = clips.first();
  await motion.getByRole('button').click();
  const dialog = page.getByRole('dialog', {
    name: 'Watch the ripples and floating cork',
  });
  const video = dialog.locator('video');
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute('preload', 'none');
  await expect(video).toHaveAttribute('controls', '');
  expect(
    await video.evaluate((element: HTMLVideoElement) => ({
      muted: element.muted,
      autoplay: element.autoplay,
      paused: element.paused,
    })),
  ).toEqual({ muted: true, autoplay: false, paused: true });
  const handle = await video.elementHandle();
  expect(
    await video.evaluate((element: HTMLVideoElement) =>
      element.canPlayType('video/mp4'),
    ),
  ).not.toBe('');
  await video.evaluate((element: HTMLVideoElement) => element.play());
  await expect
    .poll(() =>
      video.evaluate((element: HTMLVideoElement) => element.currentTime),
    )
    .toBeGreaterThan(0);
  expect(
    await video.evaluate((element: HTMLVideoElement) => element.duration),
  ).toBeGreaterThan(5);
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('video')).toHaveCount(0);
  await expect(motion.getByRole('button')).toBeFocused();
  expect(
    await handle!.evaluate((element: HTMLVideoElement) => element.paused),
  ).toBe(true);
  await handle!.dispose();
});

test('a failed external clip explains the fallback and can reopen its player', async ({
  page,
}) => {
  await page.route('https://v3b.fal.media/**', (route) => route.abort());
  await page.goto('./#waves');
  const overlap = page.locator('.wave-video').nth(1);
  await overlap.getByRole('button').click();
  const dialog = page.getByRole('dialog', { name: 'Watch ripples meet' });
  const video = dialog.locator('video');
  await expect(video).toBeVisible();
  await video.evaluate(async (element: HTMLVideoElement) => {
    try {
      await element.play();
    } catch {
      /* Error text is the expected UI. */
    }
  });
  await expect(dialog.getByRole('status')).toContainText(
    'measured diagrams above',
  );
  await expect(dialog.locator('video')).toHaveCount(0);
  await dialog
    .getByRole('button', { name: 'Show the player again', exact: true })
    .click();
  await expect(dialog.locator('video')).toBeVisible();
  await expect(page.locator('[data-testid="wave-basics"]')).toHaveCount(1);
});

test('clip controls and bundled assets fit both themes at narrow and desktop widths', async ({
  page,
}) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./#waves');
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      const clip = page.locator('.wave-video').first();
      await clip.getByRole('button').click();
      const dialog = page.getByRole('dialog', {
        name: 'Watch the ripples and floating cork',
      });
      await expect(dialog.locator('video')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await expect(dialog.locator('.wave-video-note')).toContainText(
        'AI-generated illustration',
      );
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    }
  }
  for (const file of [
    'moving-pattern.mp4',
    'moving-pattern.webp',
    'overlapping-ripples.webp',
    'provenance.json',
  ]) {
    const response = await page.request.get(`./media/waves/${file}`);
    expect(response.ok(), file).toBe(true);
    expect(response.headers()['content-type']).not.toContain('text/html');
  }
});
