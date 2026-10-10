import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32 } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { prepareExamples } from '../../scripts/prepare-examples.mjs';
import { physicsLessons } from '../../src/lessons/foundations/physics';
import { classicalLessons } from '../../src/lessons/foundations/classical';
import { appliedLessons } from '../../src/lessons/foundations/applied';

const root = fileURLToPath(new URL('../../', import.meta.url));
const filenames = [
  'README.md',
  'requirements.txt',
  'quantum_basics.py',
  'classical_ml.py',
  'quantum_classifier.py',
  'quantum_tomography.py',
  'verify_examples.py',
];

function readStoredZip(zip: Buffer) {
  const entries = new Map<string, Buffer>();
  let offset = 0;
  while (zip.readUInt32LE(offset) === 0x04034b50) {
    expect(zip.readUInt16LE(offset + 8)).toBe(0);
    const length = zip.readUInt32LE(offset + 18);
    expect(zip.readUInt32LE(offset + 22)).toBe(length);
    const nameLength = zip.readUInt16LE(offset + 26);
    const extraLength = zip.readUInt16LE(offset + 28);
    const name = zip
      .subarray(offset + 30, offset + 30 + nameLength)
      .toString('utf8');
    expect(name).not.toContain('..');
    const dataStart = offset + 30 + nameLength + extraLength;
    const data = zip.subarray(dataStart, dataStart + length);
    expect(crc32(data)).toBe(zip.readUInt32LE(offset + 14));
    entries.set(name, data);
    offset = dataStart + length;
  }
  expect(zip.readUInt32LE(offset)).toBe(0x02014b50);
  const end = zip.length - 22;
  expect(zip.readUInt32LE(end)).toBe(0x06054b50);
  expect(zip.readUInt16LE(end + 8)).toBe(entries.size);
  expect(zip.readUInt16LE(end + 10)).toBe(entries.size);
  expect(zip.readUInt32LE(end + 16)).toBe(offset);
  expect(zip.readUInt32LE(end + 12)).toBe(end - offset);
  return entries;
}

describe('downloadable learning kit', () => {
  it('packages the actual runnable sources and reproducible direct downloads', async () => {
    const temporary = mkdtempSync(join(tmpdir(), 'quantum-learning-kit-'));
    try {
      expect(await prepareExamples(temporary)).toBe(filenames.length);
      const zip = readFileSync(join(temporary, 'learning-kit.zip'));
      const entries = readStoredZip(zip);
      expect([...entries.keys()]).toEqual(
        filenames.map((name) => `learning-kit/${name}`),
      );
      for (const name of filenames) {
        const source = readFileSync(join(root, 'examples', name));
        expect(entries.get(`learning-kit/${name}`)).toEqual(source);
        expect(readFileSync(join(temporary, 'examples', name))).toEqual(source);
      }
      const lessonScripts = [
        ...physicsLessons,
        ...classicalLessons,
        ...appliedLessons,
      ]
        .flatMap((lesson) => lesson.sections ?? [])
        .flatMap((section) => (section.code?.filename ? [section.code] : []));
      expect(lessonScripts.length).toBeGreaterThanOrEqual(10);
      for (const script of lessonScripts) {
        expect(
          readFileSync(join(temporary, 'examples', script.filename!), 'utf8'),
        ).toBe(`${script.code.trimEnd()}\n`);
      }
      await prepareExamples(temporary);
      expect(readFileSync(join(temporary, 'learning-kit.zip'))).toEqual(zip);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  });
});
