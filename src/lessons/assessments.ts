import { quantumAssessments } from './quantum-assessments';

type FoundationAssessmentLessonId = 'why' | 'waves' | 'math';
export type AssessmentLessonId =
  | FoundationAssessmentLessonId
  | 'states'
  | 'measurement'
  | 'gates'
  | 'entanglement';

export type AssessmentQuestion = {
  id: string;
  topic: string;
  prompt: string;
  choices: { text: string; explanation: string }[];
  correct: number;
};

const foundationAssessments: Record<
  FoundationAssessmentLessonId,
  { introduction: string; questions: AssessmentQuestion[] }
> = {
  why: {
    introduction:
      'Three short questions connect the hydrogen example to photons and everyday technology.',
    questions: [
      {
        id: 'why-energy-levels',
        topic: 'Allowed energy changes',
        prompt:
          'A hydrogen atom emits a few distinct colours rather than every colour. What does this tell us?',
        choices: [
          {
            text: 'Its electrons can make specific allowed energy changes.',
            explanation:
              'An atom has allowed energy levels. A transition between two levels releases a particular amount of energy, producing a spectral line.',
          },
          {
            text: 'Its electrons can lose any amount of energy continuously.',
            explanation:
              'Continuous energy changes would not explain the distinct lines. The gaps between allowed levels select the emitted photon energies.',
          },
          {
            text: 'A filter inside every hydrogen atom removes the other colours.',
            explanation:
              'The atom does not contain a colour filter. The emitted colours follow from its allowed energy differences.',
          },
        ],
        correct: 0,
      },
      {
        id: 'why-photon-energy',
        topic: 'Energy and colour',
        prompt:
          'An electron drops between two allowed levels. What determines the energy of the emitted photon?',
        choices: [
          {
            text: 'How bright the whole light source looks.',
            explanation:
              'Brightness can increase when more photons arrive. It does not set the energy of an individual photon from this transition.',
          },
          {
            text: 'The energy difference between those two levels.',
            explanation:
              'The photon carries the energy lost by the atom. Different energy gaps correspond to different photon frequencies and therefore different colours for visible light.',
          },
          {
            text: 'How long a person looks at the light.',
            explanation:
              'Looking longer changes how much light is collected, not the energy gap in the atom or the energy of each emitted photon.',
          },
        ],
        correct: 1,
      },
      {
        id: 'why-useful-model',
        topic: 'Why this matters',
        prompt: 'Why is quantum mechanics useful for understanding an LED?',
        choices: [
          {
            text: 'It lets us predict every detail without knowing the material.',
            explanation:
              'Predictions still require a model of the material and its conditions. Quantum mechanics supplies the rules, not every input to a calculation.',
          },
          {
            text: 'An LED works only when its light is observed.',
            explanation:
              'The physical processes in an LED do not require a person to watch. Observation by a person is not what makes it emit light.',
          },
          {
            text: 'The material’s allowed electronic energies help determine the light it emits.',
            explanation:
              'In an LED, electronic transitions in a semiconductor release energy as light. Understanding the material’s energy structure helps explain and design its colour.',
          },
        ],
        correct: 2,
      },
    ],
  },
  waves: {
    introduction:
      'Eight questions test the picture, the predictions, and the difference between a wave and a probability amplitude.',
    questions: [
      {
        id: 'waves-amplitude',
        topic: 'Amplitude and displacement',
        prompt:
          'A water wave has amplitude 2 cm. At one moment a cork is 1 cm below its resting level. Which description is correct?',
        choices: [
          {
            text: 'Displacement: −1 cm. Amplitude: 2 cm.',
            explanation:
              'Displacement is the signed position at this moment. Amplitude is the greatest distance from the resting level. The cork moves mainly locally as the pattern travels.',
          },
          {
            text: 'Displacement: 1 cm. Amplitude: −2 cm.',
            explanation:
              'Below the resting level means negative displacement. Amplitude is a non-negative size, so it is 2 cm, not −2 cm.',
          },
          {
            text: 'Displacement and amplitude are both −1 cm.',
            explanation:
              'The momentary position and the largest excursion describe different things. Passing through −1 cm does not change the wave’s 2 cm amplitude.',
          },
        ],
        correct: 0,
      },
      {
        id: 'waves-frequency',
        topic: 'Frequency and one cycle',
        prompt:
          'At a fixed point, the wave completes four cycles in two seconds. What is its frequency?',
        choices: [
          {
            text: '4 cycles per second.',
            explanation:
              'Four is the number of cycles in the whole two-second observation. Frequency counts cycles in one second: 4 ÷ 2 = 2.',
          },
          {
            text: '2 cycles per second.',
            explanation:
              'Frequency is cycles divided by elapsed time: 4 ÷ 2 = 2 Hz. Each cycle takes half a second. It measures repetition in time, not wave height.',
          },
          {
            text: '0.5 cycles per second.',
            explanation:
              '0.5 seconds is the time for one cycle here. That is the period; the frequency is its reciprocal, 2 cycles per second.',
          },
        ],
        correct: 1,
      },
      {
        id: 'waves-wavelength',
        topic: 'Wavelength and amplitude',
        prompt:
          'Two snapshots have crests 30 cm apart. In the second, the crests are twice as high. What has changed?',
        choices: [
          {
            text: 'The wavelength has doubled.',
            explanation:
              'Wavelength is the spacing between neighbouring crests. That spacing is still 30 cm; making the crests taller changes amplitude.',
          },
          {
            text: 'The frequency must have doubled.',
            explanation:
              'A taller snapshot does not establish a faster repetition rate. Frequency is measured by watching cycles pass a fixed point over time.',
          },
          {
            text: 'The amplitude has doubled; the wavelength is still 30 cm.',
            explanation:
              'Height and spacing are separate measurements. The second wave has greater amplitude, while the distance between crests remains unchanged.',
          },
        ],
        correct: 2,
      },
      {
        id: 'waves-phase',
        topic: 'Relative phase',
        prompt:
          'Wave B is shifted by one full cycle relative to an otherwise identical wave A. How do their crests line up?',
        choices: [
          {
            text: 'They line up again, just as at a 0° shift.',
            explanation:
              'A full cycle is 360°, so it returns to the same part of the repeating pattern. A 90° shift is a quarter cycle; 180° puts a crest opposite a trough.',
          },
          {
            text: 'A crest of A lines up with a trough of B.',
            explanation:
              'For these identical sinusoidal waves, crest against trough corresponds to half a cycle, 180°, rather than a full 360° cycle.',
          },
          {
            text: 'Wave B now has twice the amplitude.',
            explanation:
              'A phase shift changes alignment within the cycle. It does not change the amplitude of either individual wave.',
          },
        ],
        correct: 0,
      },
      {
        id: 'waves-superposition',
        topic: 'Adding waves at a point',
        prompt:
          'At the marked point, wave A contributes +1 cm and wave B contributes −1 cm. What can you conclude?',
        choices: [
          {
            text: 'The total displacement there is 2 cm.',
            explanation:
              'Signed displacements add: +1 + (−1) = 0. Adding their sizes alone would lose the information that one is above and one below the resting level.',
          },
          {
            text: 'The total displacement there is zero; this does not prove all wave energy has vanished.',
            explanation:
              'This is cancellation of displacement at that point. Total energy depends on more than one displacement value. Similarly, a dark quantum output does not mean total detection probability disappears.',
          },
          {
            text: 'Both waves disappear everywhere after meeting.',
            explanation:
              'A zero sum at one point is not evidence that both waves cease to exist everywhere. Superposition combines contributions locally.',
          },
        ],
        correct: 1,
      },
      {
        id: 'waves-detection-pattern',
        topic: 'Individual events and a pattern',
        prompt:
          'The screen registers one particle at one position. What does that single detection show?',
        choices: [
          {
            text: 'The whole interference pattern.',
            explanation:
              'One click gives only one outcome. The distribution becomes visible through many fresh repetitions of the same preparation.',
          },
          {
            text: 'A definite record of which route the particle took.',
            explanation:
              'A screen position alone need not identify a route. Which-path information requires a physical record that distinguishes the alternatives.',
          },
          {
            text: 'One sampled outcome; many repetitions are needed to estimate the distribution.',
            explanation:
              'Each detection is localized. Counts accumulated over many repetitions approach the predicted probabilities, with fluctuations in any finite sample.',
          },
        ],
        correct: 2,
      },
      {
        id: 'waves-born-rule',
        topic: 'Amplitudes become probabilities',
        prompt:
          'At 180° in the laboratory, the two indistinguishable paths contribute equal amplitudes pointing in opposite directions at bin 1. What is the probability there?',
        choices: [
          {
            text: '0%: add the amplitudes first, then square the magnitude.',
            explanation:
              'The equal opposite amplitudes sum to zero, so their total squared magnitude is zero. The probabilities across all 16 bins still sum to 100%; cancellation at bin 1 redistributes the pattern.',
          },
          {
            text: '6.25%: square each contribution first, then add.',
            explanation:
              'That calculation discards the relative sign and therefore the interference. For coherent indistinguishable alternatives, add amplitudes before taking the squared magnitude.',
          },
          {
            text: 'A negative probability, because one amplitude points the other way.',
            explanation:
              'Amplitudes may have signs or complex phases, but probabilities cannot be negative. Taking the squared magnitude gives a non-negative value.',
          },
        ],
        correct: 0,
      },
      {
        id: 'waves-path-record',
        topic: 'A physical path record',
        prompt:
          'An ideal detector leaves perfectly distinguishable records of the two routes, but nobody reads them. What happens to the screen pattern in our model?',
        choices: [
          {
            text: 'Interference stays until somebody looks at the records.',
            explanation:
              'A person’s awareness is not the condition. The physical interaction and distinguishability of the path records matter.',
          },
          {
            text: 'Interference disappears even if nobody reads the records.',
            explanation:
              'Perfect path records remove the interference term in the screen probabilities. Our ideal equal-path model then gives 1/16 in every bin, independently of the phase setting.',
          },
          {
            text: 'The particle can no longer reach the screen.',
            explanation:
              'Removing interference changes the distribution, not whether detections are possible. The probabilities still add to 1.',
          },
        ],
        correct: 1,
      },
    ],
  },
  math: {
    introduction:
      'Eight questions connect probabilities, complex arrows, normalization, and the measurement settings that reveal phase.',
    questions: [
      {
        id: 'math-probability-total',
        topic: 'All outcomes count',
        prompt:
          'A measurement has just two possible outcomes. If P(0) is 0.36, what must P(1) be?',
        choices: [
          {
            text: '0.64',
            explanation:
              'The outcomes cover every possibility, so their probabilities add to 1. The remaining probability is 1 − 0.36 = 0.64.',
          },
          {
            text: '0.80',
            explanation:
              '0.80 could be an amplitude magnitude whose square is 0.64. The probability itself is 0.64.',
          },
          {
            text: '0.36',
            explanation:
              'Equal probabilities are possible, but they would both be 0.50. Here 0.36 + 0.36 leaves some probability unaccounted for.',
          },
        ],
        correct: 0,
      },
      {
        id: 'math-amplitude-square',
        topic: 'Amplitude versus probability',
        prompt:
          'The amplitude for outcome 0 is −0.6 in a normalized state. What is P(0)?',
        choices: [
          {
            text: '−0.36',
            explanation:
              'Probabilities are nonnegative. The amplitude can be negative, but its squared magnitude is (−0.6)² = 0.36.',
          },
          {
            text: '0.60',
            explanation:
              '0.60 is the amplitude magnitude. Probability is that magnitude squared: 0.36.',
          },
          {
            text: '0.36',
            explanation:
              'Taking the squared magnitude removes the sign: (−0.6)² = 0.36. The sign still matters before squaring when this amplitude interferes with another.',
          },
        ],
        correct: 2,
      },
      {
        id: 'math-complex-components',
        topic: 'A complex arrow',
        prompt:
          'An amplitude is 0.3 + 0.4i. Which is its probability, and which is its length?',
        choices: [
          {
            text: 'Probability 0.7; length 0.7.',
            explanation:
              'Adding the real and imaginary components is not a length calculation. Their squared lengths add: 0.09 + 0.16 = 0.25.',
          },
          {
            text: 'Probability 0.25; length 0.5.',
            explanation:
              'The squared magnitude is 0.3² + 0.4² = 0.25. Its magnitude is √0.25 = 0.5. Probability uses the square, not the length.',
          },
          {
            text: 'Probability 0.5; length 0.25.',
            explanation:
              'These quantities are reversed. Pythagoras gives length 0.5; squaring that length gives probability 0.25.',
          },
        ],
        correct: 1,
      },
      {
        id: 'math-normalization',
        topic: 'One denominator for the whole vector',
        prompt:
          'You want to turn [3, 4i] into a normalized state. Which calculation keeps its proportions and phase?',
        choices: [
          {
            text: 'Divide both entries by 5, giving [0.6, 0.8i].',
            explanation:
              'The common vector length is √(3² + 4²) = 5. The resulting probabilities are 0.36 and 0.64, totaling 1.',
          },
          {
            text: 'Divide the first entry by 3 and the second by 4, giving [1, i].',
            explanation:
              'This changes their proportions and leaves squared magnitudes totaling 2. Every entry must share the same denominator.',
          },
          {
            text: 'Divide both entries by 7 because 3 + 4 = 7.',
            explanation:
              'The length comes from squared magnitudes, not their sum. Dividing by 7 produces a total probability of 25/49, not 1.',
          },
        ],
        correct: 0,
      },
      {
        id: 'math-entry-order',
        topic: 'What vector entries mean',
        prompt:
          'In the reference basis, the state vector is [0.6, 0.8i]. What do its entries refer to?',
        choices: [
          {
            text: 'The locations of two separate particles.',
            explanation:
              'The two entries are amplitude coefficients for reference outcomes of one state. They do not identify two particles or their spatial coordinates.',
          },
          {
            text: 'The probabilities 60% and 80%.',
            explanation:
              'These are amplitudes, not probabilities. Their squared magnitudes are 36% and 64%.',
          },
          {
            text: 'The amplitudes for outcomes 0 and 1, in that order.',
            explanation:
              'A chosen basis gives the entries their meaning. Here entry 0 belongs to reference outcome 0, and entry 1 belongs to outcome 1.',
          },
        ],
        correct: 2,
      },
      {
        id: 'math-relative-phase',
        topic: 'Reveal a hidden phase',
        prompt:
          'Compare [1/√2, 1/√2] with [1/√2, −1/√2]. Which prediction is correct?',
        choices: [
          {
            text: 'Z can distinguish them because a negative entry means a negative probability.',
            explanation:
              'Squaring the magnitude makes both Z probabilities 1/2 for either state. A negative amplitude does not give a negative probability.',
          },
          {
            text: 'Z gives 50/50 for both; X gives + for the first and − for the second with certainty.',
            explanation:
              'Z reads the individual squared magnitudes. X combines the amplitudes: the aligned pair reinforces in the sum, while the opposite pair reinforces in the difference.',
          },
          {
            text: 'Every measurement gives the same probabilities because the lengths match.',
            explanation:
              'The matching lengths only establish matching Z probabilities. Relative direction can affect another setting that combines amplitudes.',
          },
        ],
        correct: 1,
      },
      {
        id: 'math-global-phase',
        topic: 'Turn every arrow together',
        prompt:
          'You multiply every amplitude in a state by i, turning all arrows by 90°. What changes?',
        choices: [
          {
            text: 'Only its mathematical global phase; every measurement probability stays the same.',
            explanation:
              'The relative angles stay fixed. Every measurement amplitude receives the same unit-magnitude factor, so every squared magnitude is unchanged.',
          },
          {
            text: 'The Z probabilities swap while X stays fixed.',
            explanation:
              'A common phase does not swap amplitude magnitudes or probabilities. It changes neither Z nor X predictions.',
          },
          {
            text: 'The relative phase increases by 90°, so interference changes.',
            explanation:
              'Both arrows turn equally. Their difference in angle does not change; this is global phase, not a relative-phase change.',
          },
        ],
        correct: 0,
      },
      {
        id: 'math-add-before-square',
        topic: 'Combining amplitudes',
        prompt:
          'Two coherent contributions to one outcome are +0.5 and −0.5. What is that outcome’s probability?',
        choices: [
          {
            text: '0.50, because 0.5² + (−0.5)² = 0.50.',
            explanation:
              'Squaring separately removes the relative sign and misses interference. Coherent contributions to the same outcome must be combined first.',
          },
          {
            text: '1.00, because both magnitudes are 0.5.',
            explanation:
              'Summing magnitudes ignores direction. The contributions point opposite ways and cancel before probability is calculated.',
          },
          {
            text: '0.00, because |0.5 − 0.5|² = 0.',
            explanation:
              'The amplitudes cancel exactly. This is the same add-first rule used by the interference measurement; other possible outcomes still account for the remaining probability.',
          },
        ],
        correct: 2,
      },
    ],
  },
};

export const assessments = {
  ...foundationAssessments,
  ...quantumAssessments,
} satisfies Record<
  AssessmentLessonId,
  { introduction: string; questions: AssessmentQuestion[] }
>;

export function hasLessonAssessment(id: string): id is AssessmentLessonId {
  return Object.hasOwn(assessments, id);
}
