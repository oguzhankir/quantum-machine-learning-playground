import katex from 'katex';
import { describe, expect, it } from 'vitest';
import {
  physicsHistory,
  qmlHistory,
  researchDirections,
  researchSnapshot,
} from '../../src/content/history';
import { lessons } from '../../src/lessons/foundations/content';

const lessonIds = new Set(lessons.map(({ id }) => id));
const timelines = [
  { track: 'physics', events: physicsHistory },
  { track: 'qml', events: qmlHistory },
] as const;
const events = timelines.flatMap(({ events: entries }) => entries);
const allEntries = [...events, ...researchDirections];
const references = allEntries.flatMap(({ sources }) => sources);
const reviewedAt = new Date(`${researchSnapshot.reviewedAt}T00:00:00Z`);

describe('history and research reading paths', () => {
  it('keeps deep-link identities distinct and milestones chronological in each track', () => {
    expect(new Set(events.map(({ id }) => id)).size).toBe(events.length);
    expect(new Set(researchDirections.map(({ id }) => id)).size).toBe(
      researchDirections.length,
    );
    for (const { track, events: entries } of timelines) {
      expect(entries.length).toBeGreaterThan(1);
      expect(entries.map(({ year }) => year)).toEqual(
        entries.map(({ year }) => year).sort((a, b) => a - b),
      );
      const eraRuns = entries
        .filter((entry, index) => entry.era !== entries[index - 1]?.era)
        .map(({ era }) => era);
      expect(
        new Set(eraRuns).size,
        `${track}: eras must stay chronological`,
      ).toBe(eraRuns.length);
      for (const event of entries) {
        expect(event.track).toBe(track);
        expect(event.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        expect(Number.isInteger(event.year)).toBe(true);
        expect(event.year).toBeLessThanOrEqual(reviewedAt.getUTCFullYear());
      }
    }
  });

  it('connects every milestone and research experiment to available lessons', () => {
    for (const event of events) {
      expect(event.lessons.length, event.id).toBeGreaterThan(0);
      for (const lessonId of event.lessons) {
        expect(lessonIds.has(lessonId), `${event.id}: ${lessonId}`).toBe(true);
      }
      expect(event.answer.length, event.id).toBeGreaterThan(0);
      expect(event.limit.trim().length, event.id).toBeGreaterThan(0);
      expect(event.bridge.trim().length, event.id).toBeGreaterThan(0);
    }
    for (const direction of researchDirections) {
      expect(direction.prerequisites.length, direction.id).toBeGreaterThan(0);
      for (const lessonId of direction.prerequisites) {
        expect(lessonIds.has(lessonId), `${direction.id}: ${lessonId}`).toBe(
          true,
        );
      }
      expect(direction.experiment.steps.length, direction.id).toBeGreaterThan(
        0,
      );
      expect(
        direction.experiment.deliverable.trim().length,
        direction.id,
      ).toBeGreaterThan(0);
      expect(direction.bottlenecks.length, direction.id).toBeGreaterThan(0);
      expect(direction.notClaimed.trim().length, direction.id).toBeGreaterThan(
        0,
      );
    }
  });

  it('provides definitions and independently renderable formulas for beginners', () => {
    for (const entry of allEntries) {
      expect(entry.concepts.length, entry.id).toBeGreaterThan(0);
      expect(
        new Set(entry.concepts.map(({ term }) => term)).size,
        entry.id,
      ).toBe(entry.concepts.length);
      for (const concept of entry.concepts) {
        expect(concept.term.trim().length, entry.id).toBeGreaterThan(0);
        expect(
          concept.meaning.trim().length,
          `${entry.id}: ${concept.term}`,
        ).toBeGreaterThan(0);
      }
    }
    for (const event of events) {
      for (const { formula, meaning } of event.formulas ?? []) {
        expect(meaning.trim().length, event.id).toBeGreaterThan(0);
        expect(
          () =>
            katex.renderToString(formula, {
              throwOnError: true,
              strict: 'error',
              trust: false,
            }),
          `${event.id}: ${formula}`,
        ).not.toThrow();
      }
    }
  });

  it('keeps citation identities, metadata, and dated evidence internally consistent', () => {
    expect(Number.isNaN(reviewedAt.getTime())).toBe(false);
    const seen = new Map<string, (typeof references)[number]>();
    for (const entry of allEntries) {
      expect(entry.sources.length, entry.id).toBeGreaterThan(0);
      expect(new Set(entry.sources.map(({ id }) => id)).size, entry.id).toBe(
        entry.sources.length,
      );
      for (const reference of entry.sources) {
        expect(reference.title.trim().length, reference.id).toBeGreaterThan(0);
        expect(reference.authors.trim().length, reference.id).toBeGreaterThan(
          0,
        );
        expect(Number.isInteger(reference.year), reference.id).toBe(true);
        expect(reference.year, reference.id).toBeLessThanOrEqual(
          reviewedAt.getUTCFullYear(),
        );
        const url = new URL(reference.url);
        expect(url.protocol, reference.id).toBe('https:');
        expect(url.hostname.length, reference.id).toBeGreaterThan(0);
        const previous = seen.get(reference.id);
        if (previous) {
          expect({ ...reference, note: undefined }, reference.id).toEqual({
            ...previous,
            note: undefined,
          });
        } else seen.set(reference.id, reference);
      }
    }
    expect(researchSnapshot.latestEvidenceYear).toBe(
      Math.max(...references.map(({ year }) => year)),
    );
    if (researchSnapshot.evidenceThrough) {
      const evidenceThrough = new Date(
        `${researchSnapshot.evidenceThrough}T00:00:00Z`,
      );
      expect(Number.isNaN(evidenceThrough.getTime())).toBe(false);
      expect(evidenceThrough.getTime()).toBeLessThanOrEqual(
        reviewedAt.getTime(),
      );
      expect(evidenceThrough.getUTCFullYear()).toBe(
        researchSnapshot.latestEvidenceYear,
      );
    }
    expect(researchSnapshot.scope.trim().length).toBeGreaterThan(0);
    expect(researchSnapshot.assessment.length).toBeGreaterThan(0);
    expect(researchSnapshot.questions.length).toBeGreaterThan(0);
  });
});
