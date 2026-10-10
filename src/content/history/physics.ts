import type { Reference, TimelineEvent } from './types';

const references: Record<string, Reference> = {
  planck: {
    id: 'planck-facts',
    title: 'Max Planck: the 1900 energy-quantum proposal',
    authors: 'Nobel Prize Outreach',
    year: 1918,
    url: 'https://www.nobelprize.org/prizes/physics/1918/planck/facts/',
    kind: 'official',
    note: 'The page is organized by the 1918 prize; the scientific milestone occurred in 1900.',
  },
  planckLecture: {
    id: 'planck-lecture',
    title: 'The origin and development of the quantum theory',
    authors: 'Max Planck',
    year: 1920,
    url: 'https://www.nobelprize.org/prizes/physics/1918/planck/lecture/',
    kind: 'primary',
    note: 'A retrospective Nobel lecture delivered on 2 June 1920.',
  },
  einstein: {
    id: 'einstein-light-quanta',
    title:
      'On a heuristic point of view concerning the production and transformation of light',
    authors: 'Albert Einstein',
    year: 1905,
    url: 'https://doi.org/10.1002/andp.19053220607',
    kind: 'primary',
    note: 'English translation of the original German paper title.',
  },
  einsteinFacts: {
    id: 'einstein-facts',
    title: 'Albert Einstein: light quanta and the photoelectric effect',
    authors: 'Nobel Prize Outreach',
    year: 1921,
    url: 'https://www.nobelprize.org/prizes/physics/1921/einstein/facts/',
    kind: 'official',
    note: 'The prize year is 1921; the light-quantum paper appeared in 1905.',
  },
  bohr: {
    id: 'bohr-atoms',
    title: 'On the constitution of atoms and molecules, Part I',
    authors: 'Niels Bohr',
    year: 1913,
    url: 'https://doi.org/10.1080/14786441308634955',
    kind: 'primary',
  },
  bohrFacts: {
    id: 'bohr-facts',
    title: 'Niels Bohr: the 1913 hydrogen model',
    authors: 'Nobel Prize Outreach',
    year: 1922,
    url: 'https://www.nobelprize.org/prizes/physics/1922/bohr/facts/',
    kind: 'official',
    note: 'The model predates the 1922 Nobel Prize.',
  },
  stern: {
    id: 'stern-gerlach-original',
    title: 'Experimental proof of directional quantization in a magnetic field',
    authors: 'Walther Gerlach and Otto Stern',
    year: 1922,
    url: 'https://doi.org/10.1007/BF01326983',
    kind: 'primary',
    note: 'English translation of the original German paper title.',
  },
  sternFacts: {
    id: 'stern-facts',
    title: 'Otto Stern: the silver-atom beam experiment',
    authors: 'Nobel Prize Outreach',
    year: 1943,
    url: 'https://www.nobelprize.org/prizes/physics/1943/stern/facts/',
    kind: 'official',
    note: 'The experiment was performed in 1922; this page is indexed by Stern’s prize year.',
  },
  broglie: {
    id: 'broglie-facts',
    title: 'Louis de Broglie: the 1924 matter-wave proposal',
    authors: 'Nobel Prize Outreach',
    year: 1929,
    url: 'https://www.nobelprize.org/prizes/physics/1929/broglie/facts/',
    kind: 'official',
  },
  broglieLecture: {
    id: 'broglie-lecture',
    title: 'The wave nature of the electron',
    authors: 'Louis de Broglie',
    year: 1929,
    url: 'https://www.nobelprize.org/uploads/2016/04/broglie-lecture.pdf',
    kind: 'primary',
    note: 'A retrospective Nobel lecture; the thesis milestone is 1924.',
  },
  heisenberg: {
    id: 'heisenberg-matrix-mechanics',
    title:
      'Quantum-theoretical reinterpretation of kinematic and mechanical relations',
    authors: 'Werner Heisenberg',
    year: 1925,
    url: 'https://doi.org/10.1007/BF01328377',
    kind: 'primary',
    note: 'English translation of the original German paper title.',
  },
  bornJordan: {
    id: 'born-jordan-matrices',
    title: 'On quantum mechanics',
    authors: 'Max Born and Pascual Jordan',
    year: 1925,
    url: 'https://doi.org/10.1007/BF01328531',
    kind: 'primary',
    note: 'The matrix formulation was developed collaboratively, rather than by one person alone.',
  },
  spin: {
    id: 'uhlenbeck-goudsmit-spin',
    title: 'Spinning electrons and the structure of spectra',
    authors: 'George Uhlenbeck and Samuel Goudsmit',
    year: 1926,
    url: 'https://doi.org/10.1038/117264a0',
    kind: 'primary',
    note: 'This 1926 communication explicitly refers to their November 1925 spin proposal.',
  },
  schrodinger: {
    id: 'schrodinger-eigenvalue',
    title: 'Quantization as an eigenvalue problem, Part I',
    authors: 'Erwin Schrödinger',
    year: 1926,
    url: 'https://doi.org/10.1002/andp.19263840404',
    kind: 'primary',
    note: 'English translation of the original German paper title.',
  },
  bornLecture: {
    id: 'born-statistical-interpretation',
    title: 'The statistical interpretation of quantum mechanics',
    authors: 'Max Born',
    year: 1954,
    url: 'https://www.nobelprize.org/uploads/2018/06/born-lecture.pdf',
    kind: 'primary',
    note: 'Born’s Nobel lecture looks back at the interpretation introduced in 1926.',
  },
  uncertainty: {
    id: 'heisenberg-uncertainty',
    title:
      'On the physical content of quantum-theoretical kinematics and mechanics',
    authors: 'Werner Heisenberg',
    year: 1927,
    url: 'https://doi.org/10.1007/BF01397280',
    kind: 'primary',
    note: 'English translation of the original German paper title.',
  },
  robertson: {
    id: 'robertson-uncertainty',
    title: 'The uncertainty principle',
    authors: 'Howard P. Robertson',
    year: 1929,
    url: 'https://doi.org/10.1103/PhysRev.34.163',
    kind: 'primary',
    note: 'A later formal statement of the standard-deviation inequality used below.',
  },
  epr: {
    id: 'epr-1935',
    title:
      'Can quantum-mechanical description of physical reality be considered complete?',
    authors: 'Albert Einstein, Boris Podolsky, and Nathan Rosen',
    year: 1935,
    url: 'https://doi.org/10.1103/PhysRev.47.777',
    kind: 'primary',
  },
  entanglement: {
    id: 'schrodinger-entanglement',
    title: 'Discussion of probability relations between separated systems',
    authors: 'Erwin Schrödinger',
    year: 1935,
    url: 'https://doi.org/10.1017/S0305004100013554',
    kind: 'primary',
  },
  bell: {
    id: 'bell-1964',
    title: 'On the Einstein Podolsky Rosen paradox',
    authors: 'John S. Bell',
    year: 1964,
    url: 'https://doi.org/10.1103/PhysicsPhysiqueFizika.1.195',
    kind: 'primary',
  },
  chsh: {
    id: 'chsh-1969',
    title: 'Proposed experiment to test local hidden-variable theories',
    authors:
      'John F. Clauser, Michael A. Horne, Abner Shimony, and Richard A. Holt',
    year: 1969,
    url: 'https://doi.org/10.1103/PhysRevLett.23.880',
    kind: 'primary',
    note: 'The CHSH inequality is a later experimental form, rather than Bell’s original 1964 equation.',
  },
  feynman: {
    id: 'feynman-simulation',
    title: 'Simulating physics with computers',
    authors: 'Richard P. Feynman',
    year: 1982,
    url: 'https://doi.org/10.1007/BF02650179',
    kind: 'primary',
    note: 'The published paper grew from a 1981 conference talk; publication and presentation dates differ.',
  },
  deutsch: {
    id: 'deutsch-universal-computer',
    title:
      'Quantum theory, the Church–Turing principle and the universal quantum computer',
    authors: 'David Deutsch',
    year: 1985,
    url: 'https://doi.org/10.1098/rspa.1985.0070',
    kind: 'primary',
  },
  shor: {
    id: 'shor-1994',
    title:
      'Algorithms for quantum computation: discrete logarithms and factoring',
    authors: 'Peter W. Shor',
    year: 1994,
    url: 'https://doi.org/10.1109/SFCS.1994.365700',
    kind: 'primary',
  },
  shorExpanded: {
    id: 'shor-1997',
    title:
      'Polynomial-time algorithms for prime factorization and discrete logarithms on a quantum computer',
    authors: 'Peter W. Shor',
    year: 1997,
    url: 'https://doi.org/10.1137/S0097539795293172',
    kind: 'primary',
    note: 'Expanded journal version of the 1994 conference result.',
  },
  nobel2022: {
    id: 'nobel-entanglement-2022',
    title: 'How entanglement has become a powerful tool',
    authors: 'The Royal Swedish Academy of Sciences',
    year: 2022,
    url: 'https://www.nobelprize.org/prizes/physics/2022/popular-information/',
    kind: 'official',
    note: 'The 2022 award recognized experiments carried out over several decades.',
  },
  aspect: {
    id: 'aspect-time-varying-analyzers',
    title:
      'Experimental test of Bell’s inequalities using time-varying analyzers',
    authors: 'Alain Aspect, Jean Dalibard, and Gérard Roger',
    year: 1982,
    url: 'https://doi.org/10.1103/PhysRevLett.49.1804',
    kind: 'primary',
  },
  hensen: {
    id: 'hensen-loophole-free',
    title:
      'Loophole-free Bell inequality violation using electron spins separated by 1.3 kilometres',
    authors: 'Bas Hensen and colleagues',
    year: 2015,
    url: 'https://doi.org/10.1038/nature15759',
    kind: 'primary',
  },
};

export const physicsHistory: TimelineEvent[] = [
  {
    id: 'physics-planck',
    year: 1900,
    track: 'physics',
    era: 'The clues',
    title: 'Energy begins to come in steps',
    short:
      'The spectrum of a hot object forces a new rule: energy exchange comes in quanta.',
    question:
      'Why does a glowing object not emit unlimited energy at short wavelengths?',
    answer: [
      'A hot object produces a characteristic spread of light frequencies. Classical reasoning could not consistently explain the whole measured spectrum. In 1900, Max Planck obtained the correct distribution by treating the energies of the material oscillators in discrete steps.',
      'A quantum is the size of one such step. Higher frequency means a larger step. This was an important clue, rather than the complete modern theory: wavefunctions, spin, and qubits arrived later.',
    ],
    discovery:
      'Planck’s black-body radiation law introduces the energy scale hν.',
    changed:
      'Microscopic energy exchange could no longer always be modeled as smoothly adjustable.',
    limit:
      'This proposal concerned a particular radiation problem; it did not yet explain all quantum systems.',
    bridge:
      'Start with discrete energy levels before asking how quantum states evolve.',
    lessons: ['why', 'potential-well', 'schrodinger'],
    concepts: [
      {
        term: 'Quantum',
        meaning:
          'One discrete unit of a physical quantity in the relevant system.',
      },
      {
        term: 'Frequency',
        meaning: 'How many wave oscillations occur each second.',
      },
    ],
    formulas: [
      {
        formula: 'E_n = n h\\nu',
        meaning:
          'For Planck’s oscillator model, n is a nonnegative integer, h is Planck’s constant, and ν is frequency.',
      },
    ],
    sources: [references.planck, references.planckLecture],
    visual: 'quanta',
  },
  {
    id: 'physics-einstein',
    year: 1905,
    track: 'physics',
    era: 'The clues',
    title: 'Light transfers energy in packets',
    short:
      'Einstein’s light-quanta proposal explains why color matters when light ejects electrons.',
    question:
      'Why can bright red light fail where faint higher-frequency light succeeds?',
    answer: [
      'In the photoelectric effect, illuminating a material can eject electrons. Einstein proposed that light transfers energy in individual quanta. In the simple one-photon picture, an electron must receive enough energy from one quantum to overcome the material’s work function.',
      'Increasing intensity supplies more photons; increasing frequency raises the energy of each photon. Light still exhibits interference. Quantum theory eventually brings the wave description and discrete detection events into one framework.',
    ],
    discovery:
      'The light-quantum hypothesis connects photon frequency to electron kinetic energy.',
    changed: 'Intensity and energy per photon became distinct quantities.',
    limit:
      'The simple equation assumes single-photon emission; intense-light processes can involve multiple photons.',
    bridge:
      'Separate the probability of a detection from the energy carried by that detection.',
    lessons: ['waves', 'measurement', 'wavefunctions'],
    concepts: [
      { term: 'Photon', meaning: 'A quantum of the electromagnetic field.' },
      {
        term: 'Work function',
        meaning: 'The energy needed to free an electron from a material.',
      },
    ],
    formulas: [
      {
        formula: 'K_{\\max}=h\\nu-\\Phi',
        meaning:
          'Above threshold, the maximum electron kinetic energy is photon energy minus the work function Φ.',
      },
    ],
    sources: [references.einstein, references.einsteinFacts],
    visual: 'quanta',
  },
  {
    id: 'physics-bohr',
    year: 1913,
    track: 'physics',
    era: 'The clues',
    title: 'Atoms reveal discrete energy levels',
    short:
      'Bohr’s hydrogen model connects narrow spectral lines to transitions between allowed energies.',
    question:
      'Why does hydrogen emit particular colors instead of every possible color?',
    answer: [
      'Bohr proposed allowed stationary states for the hydrogen atom, with radiation emitted or absorbed when the atom changes energy. The difference between two levels determines the photon frequency. This explained major features of hydrogen’s line spectrum.',
      'The familiar planetary-orbit drawing belongs to this early model. In modern quantum mechanics, an orbital is a wavefunction, rather than a tiny planet’s trajectory. Keep the successful energy-level idea while replacing the orbit picture.',
    ],
    discovery:
      'A quantized hydrogen model explains spectral frequencies through energy differences.',
    changed:
      'An atom’s spectrum became evidence about its internal allowed states.',
    limit:
      'The orbit model cannot serve as the general description of many-electron atoms or quantum motion.',
    bridge:
      'The potential-well lab makes energy levels visible without relying on planetary orbits.',
    lessons: ['potential-well', 'wavefunctions', 'schrodinger'],
    concepts: [
      {
        term: 'Energy level',
        meaning: 'An allowed result of an energy measurement for a system.',
      },
      {
        term: 'Transition',
        meaning: 'A change between states that can exchange energy with light.',
      },
    ],
    formulas: [
      {
        formula: 'h\\nu=E_{\\mathrm{high}}-E_{\\mathrm{low}}',
        meaning:
          'The emitted photon’s energy equals the decrease in the atom’s energy.',
      },
    ],
    sources: [references.bohr, references.bohrFacts],
    visual: 'quanta',
  },
  {
    id: 'physics-stern-gerlach',
    year: 1922,
    track: 'physics',
    era: 'A new mechanics',
    title: 'A beam splits into two outcomes',
    short:
      'Stern and Gerlach see discrete magnetic deflections; the modern spin explanation follows later.',
    question:
      'What happens if an atom’s magnetic moment cannot point with every possible measured projection?',
    answer: [
      'Otto Stern and Walther Gerlach sent silver atoms through a magnetic field that varied with position. The beam separated into two parts rather than a continuous spread. The experiment provided evidence for discrete magnetic-moment projections.',
      'The researchers initially interpreted this through the old quantum theory. Electron spin was proposed in 1925 by Uhlenbeck and Goudsmit; the silver result is now understood through its unpaired electron’s spin. The observation came before its correct modern interpretation.',
    ],
    discovery:
      'Measured magnetic projections are discrete in the silver-atom beam.',
    changed: 'A two-outcome measurement became a concrete experimental fact.',
    limit:
      'Spin is intrinsic angular momentum, not a classical ball literally rotating around an axis.',
    bridge:
      'A spin-½ system is a physical example of the two-level mathematics used for a qubit.',
    lessons: ['spin', 'states', 'measurement'],
    concepts: [
      {
        term: 'Spin',
        meaning: 'Intrinsic angular momentum with quantum measurement rules.',
      },
      {
        term: 'Measurement axis',
        meaning: 'The direction defining which spin component is measured.',
      },
    ],
    formulas: [
      {
        formula:
          'S_z=+\\frac{\\hbar}{2}\\quad\\text{or}\\quad-\\frac{\\hbar}{2}',
        meaning:
          'In the modern spin-½ description, measuring one component gives one of two values.',
      },
    ],
    sources: [references.stern, references.sternFacts, references.spin],
    visual: 'spin',
  },
  {
    id: 'physics-de-broglie',
    year: 1924,
    track: 'physics',
    era: 'A new mechanics',
    title: 'Matter also has a wavelength',
    short:
      'De Broglie’s thesis extends the wave idea to particles such as electrons.',
    question:
      'If light shows particle-like detections, could matter show wave-like interference?',
    answer: [
      'Building on ideas developed in 1923, Louis de Broglie proposed in his 1924 thesis that a particle’s momentum is associated with a wavelength. Electron diffraction experiments in 1927 later supplied experimental support.',
      'A matter wave is not an electron stretched into a classical water wave. The quantum description uses amplitudes to predict detection probabilities. Small wavelengths help explain why wave effects are hard to notice for everyday moving objects.',
    ],
    discovery:
      'The wavelength–momentum relation gives matter a wave description.',
    changed:
      'Interference becomes relevant to electrons and atoms, as well as light.',
    limit:
      'A wavelength alone does not specify the complete quantum state or its time evolution.',
    bridge:
      'Use the wavefunction and interference labs to connect a wave pattern to individual outcomes.',
    lessons: ['waves', 'wavefunctions', 'potential-well'],
    concepts: [
      {
        term: 'Matter wave',
        meaning:
          'The wave-like amplitude description associated with a quantum particle.',
      },
      {
        term: 'Momentum',
        meaning:
          'A quantity associated with motion; it determines de Broglie wavelength.',
      },
    ],
    formulas: [
      {
        formula: '\\lambda=\\frac{h}{p}',
        meaning: 'Greater momentum p corresponds to a shorter wavelength λ.',
      },
    ],
    sources: [references.broglie, references.broglieLecture],
    visual: 'waves',
  },
  {
    id: 'physics-matrix-mechanics',
    year: 1925,
    track: 'physics',
    era: 'A new mechanics',
    title: 'Quantum mechanics gets a mathematical language',
    short:
      'Heisenberg, Born, and Jordan develop matrix mechanics; spin adds an intrinsic two-level degree of freedom.',
    question:
      'What if physical quantities are represented by operations rather than ordinary numbers?',
    answer: [
      'Heisenberg built a theory around observable transitions rather than assumed electron paths. Born recognized the matrix structure, and Born and Jordan developed its algebra. Matrices can act on a state, and changing the order of two matrix operations can change the result.',
      'In the same year, Uhlenbeck and Goudsmit published the electron-spin proposal, following earlier discussions and Pauli’s work on atomic structure. These developments helped replace the old orbit-based rules with a coherent mechanics of states and observables.',
    ],
    discovery:
      'Noncommuting matrices become a tool for describing quantum quantities.',
    changed:
      'Operation order becomes part of the physics, rather than an algebraic inconvenience.',
    limit:
      'A matrix is a representation in a chosen basis; its entries are not automatically measured probabilities.',
    bridge:
      'Quantum gates are matrices too: apply H then Z and compare with Z then H.',
    lessons: ['linear-algebra', 'gates', 'spin'],
    concepts: [
      {
        term: 'Operator',
        meaning:
          'A mathematical action on a state; observables and gates are examples.',
      },
      {
        term: 'Noncommuting',
        meaning:
          'Two operations give different results when their order is swapped.',
      },
    ],
    formulas: [
      {
        formula: 'AB\\ne BA',
        meaning:
          'For some quantum operators A and B, order matters. This is not true of every pair of operators.',
      },
    ],
    sources: [references.heisenberg, references.bornJordan, references.spin],
    visual: 'matrix',
  },
  {
    id: 'physics-schrodinger-born',
    year: 1926,
    track: 'physics',
    era: 'A new mechanics',
    title: 'Waves evolve; squared amplitudes predict outcomes',
    short:
      'Schrödinger supplies wave mechanics, and Born supplies the statistical interpretation.',
    question: 'What does the wavefunction mean, and how does it change?',
    answer: [
      'Schrödinger’s wave mechanics made it possible to calculate atomic states and energies through differential equations. His formulation and matrix mechanics describe the same underlying quantum theory. The Hamiltonian specifies energy and governs how a closed system’s state evolves.',
      'Born’s 1926 statistical interpretation connected the wave description to probabilities. In modern notation, the squared magnitude of a normalized amplitude gives the probability density or a discrete-outcome probability. A wavefunction is therefore an amplitude description, rather than a probability by itself.',
    ],
    discovery:
      'An evolution law and a probability rule make quantitative predictions possible.',
    changed:
      'One can calculate both how a state changes and the distribution of measurement outcomes.',
    limit:
      'Deterministic state evolution does not mean a single measurement outcome is generally predictable.',
    bridge:
      'Every QML prediction combines state preparation, circuit evolution, and a Born-rule measurement.',
    lessons: [
      'wavefunctions',
      'schrodinger',
      'measurement',
      'variational-classifier',
    ],
    concepts: [
      {
        term: 'Wavefunction',
        meaning: 'An amplitude description of a quantum state.',
      },
      {
        term: 'Hamiltonian',
        meaning: 'The energy operator that generates time evolution.',
      },
      {
        term: 'Born rule',
        meaning:
          'The rule converting state amplitudes into measurement probabilities.',
      },
    ],
    formulas: [
      {
        formula: 'i\\hbar\\frac{\\partial\\psi}{\\partial t}=\\hat H\\psi',
        meaning:
          'The Schrödinger equation describes closed-system state evolution under Hamiltonian H.',
      },
      {
        formula: 'P(a)=|\\langle a|\\psi\\rangle|^2',
        meaning:
          'For a normalized state and a rank-one projective outcome a, probability is squared overlap.',
      },
    ],
    sources: [references.schrodinger, references.bornLecture],
    visual: 'state',
  },
  {
    id: 'physics-uncertainty',
    year: 1927,
    track: 'physics',
    era: 'A new mechanics',
    title: 'Some spreads cannot both vanish',
    short:
      'Heisenberg’s uncertainty principle expresses an intrinsic constraint on incompatible quantities.',
    question:
      'Could a perfect instrument give a quantum state both an exact position and an exact momentum?',
    answer: [
      'A state concentrated tightly in position requires a broad mixture of momentum components. Heisenberg brought this constraint to the center of quantum mechanics in 1927. The standard-deviation inequality commonly taught today received a more general mathematical formulation from Robertson in 1929.',
      'Here, uncertainty means the spread of outcomes for repeated preparations of the same state. It is not merely a loose screw in an instrument. Measurement disturbance is a related subject with its own careful definitions; it should not be used as the whole explanation of this inequality.',
    ],
    discovery:
      'Incompatible observables impose limits on simultaneous outcome spreads.',
    changed:
      'There is no classical point in phase space that represents every quantum state.',
    limit:
      'The inequality concerns particular pairs of observables; it does not say that nothing can be known precisely.',
    bridge:
      'Narrow the wave packet in the lab and watch its momentum spread widen.',
    lessons: ['wavefunctions', 'spin', 'measurement'],
    concepts: [
      {
        term: 'Standard deviation',
        meaning: 'A measure of how widely repeated outcomes are spread.',
      },
      {
        term: 'Incompatible observables',
        meaning: 'Quantities whose operators do not generally commute.',
      },
    ],
    formulas: [
      {
        formula: '\\sigma_x\\sigma_p\\ge\\frac{\\hbar}{2}',
        meaning:
          'The position and momentum standard deviations obey this bound; ħ equals h divided by 2π.',
      },
    ],
    sources: [references.uncertainty, references.robertson],
    visual: 'uncertainty',
  },
  {
    id: 'physics-epr-entanglement',
    year: 1935,
    track: 'physics',
    era: 'From questions to tests',
    title: 'Entanglement challenges the picture of separate parts',
    short:
      'EPR questions completeness; Schrödinger identifies the special correlations of an entangled state.',
    question:
      'Can knowing the whole tell us something that no separate description of the parts can capture?',
    answer: [
      'Einstein, Podolsky, and Rosen considered correlated systems to argue that quantum mechanics might be incomplete. Schrödinger explored the same difficulty and developed the concept of entanglement: a joint state can fail to separate into an independent state for each subsystem.',
      'For a Bell pair, each individual measurement can look completely random while paired results show structure. This is stronger than simply sharing an ordinary prewritten answer list across every possible measurement setting. Whether such correlations can be explained locally became a testable question with Bell’s work.',
    ],
    discovery:
      'Joint quantum states can contain correlations absent from independent descriptions of the parts.',
    changed:
      'The state of a composite system becomes an essential object in its own right.',
    limit:
      'Entanglement cannot be used to send a controllable message faster than light.',
    bridge:
      'Build a Bell pair, then inspect its individual mixed states through a partial trace.',
    lessons: ['entanglement', 'density-matrices', 'linear-algebra'],
    concepts: [
      {
        term: 'Entanglement',
        meaning:
          'A joint state that cannot be expressed as independent subsystem states or their classical mixture.',
      },
      {
        term: 'Reduced state',
        meaning:
          'The state used to predict measurements on one part of a larger system.',
      },
    ],
    formulas: [
      {
        formula: '|\\Phi^+\\rangle=\\frac{|00\\rangle+|11\\rangle}{\\sqrt{2}}',
        meaning:
          'This modern two-qubit example gives matching computational-basis outcomes, with each local outcome random.',
      },
    ],
    sources: [references.epr, references.entanglement],
    visual: 'entanglement',
  },
  {
    id: 'physics-bell',
    year: 1964,
    track: 'physics',
    era: 'From questions to tests',
    title: 'A philosophical question becomes a measurable bound',
    short:
      'Bell shows that local hidden-variable explanations cannot reproduce all quantum predictions.',
    question:
      'How can an experiment distinguish entanglement from a shared classical instruction sheet?',
    answer: [
      'John Bell derived a constraint on correlations for a class of local hidden-variable theories. Quantum predictions can exceed that constraint for suitable entangled states and measurement settings. This transformed part of the EPR debate into an experimentally testable difference.',
      'A widely used later form is the CHSH inequality, introduced in 1969. It combines correlations from four pairs of measurement settings. A violation tests the model assumptions; it is not a demonstration that any two correlated particles automatically produce a violation.',
    ],
    discovery:
      'Local hidden-variable models and quantum mechanics predict different allowable correlations.',
    changed:
      'The disagreement can be addressed by collecting and comparing measurement statistics.',
    limit:
      'A convincing test must handle assumptions about settings, detection, and separation; correlation alone is insufficient.',
    bridge:
      'Learn the Bell-state lab first, then compare measurements in several bases rather than only Z.',
    lessons: ['entanglement', 'spin', 'measurement'],
    concepts: [
      {
        term: 'Hidden variable',
        meaning:
          'An additional underlying variable proposed to account for observed outcomes.',
      },
      {
        term: 'Bell inequality',
        meaning:
          'A bound on correlations following from specified local-model assumptions.',
      },
    ],
    formulas: [
      {
        formula: '|S|\\le2\\quad\\text{(local CHSH bound)}',
        meaning:
          'In the later 1969 CHSH test, quantum mechanics permits values up to 2√2 for suitable states and settings.',
      },
    ],
    sources: [references.bell, references.chsh],
    visual: 'benchmark',
  },
  {
    id: 'physics-feynman',
    year: 1982,
    displayYear: '1981–1982',
    track: 'physics',
    era: 'Quantum information',
    title: 'Use quantum systems to simulate quantum systems',
    short:
      'Feynman’s 1981 talk and 1982 paper sharpen a compelling reason to build quantum computers.',
    question:
      'What if the computer obeyed the same quantum rules as the system we wanted to simulate?',
    answer: [
      'An arbitrary pure state of n qubits has 2ⁿ complex amplitudes. Writing all of them down becomes expensive very quickly. Feynman argued for computers that use quantum physical behavior to simulate quantum physics, rather than tracking every amplitude explicitly on a classical machine.',
      'This is one influential contribution among the early proposals for quantum computation. It provides a particularly direct motivation: the problem itself is quantum. It does not imply that every quantum system is difficult for every classical method, or that every task benefits from a quantum computer.',
    ],
    discovery:
      'Quantum simulation becomes a concrete computational motivation.',
    changed:
      'Quantum behavior is treated as a computing resource, rather than only a phenomenon to explain.',
    limit:
      'Structure can make some quantum systems easy to simulate classically; useful advantage depends on the task.',
    bridge:
      'Connect Hamiltonian evolution to circuits, then consider learning properties of quantum-generated data.',
    lessons: [
      'schrodinger',
      'linear-algebra',
      'gates',
      'quantum-state-learning',
    ],
    concepts: [
      {
        term: 'Quantum simulation',
        meaning:
          'Using a controllable quantum system to study another quantum system.',
      },
      {
        term: 'State-vector scaling',
        meaning: 'The amplitude count doubles whenever a qubit is added.',
      },
    ],
    formulas: [
      {
        formula: '\\dim(\\mathcal H_n)=2^n',
        meaning:
          'The state space of n qubits has 2ⁿ basis dimensions; this alone is not a proof of computational speedup.',
      },
    ],
    sources: [references.feynman],
    visual: 'circuit',
  },
  {
    id: 'physics-deutsch',
    year: 1985,
    track: 'physics',
    era: 'Quantum information',
    title: 'A universal quantum computer becomes a theoretical model',
    short:
      'Deutsch frames quantum computation as a general programmable process.',
    question:
      'Could one kind of quantum machine run many different quantum computations?',
    answer: [
      'David Deutsch formulated a universal quantum computer and examined computation through the laws of physics. The idea moves beyond one specially constructed simulation: a programmable quantum device can implement different quantum processes.',
      'The modern circuit view prepares a state, applies a sequence of gates, and measures selected outputs. This makes quantum algorithms something we can specify and reason about. Universal means broad computational capability; it does not mean automatic speedup for every program.',
    ],
    discovery:
      'Quantum computation gains a universal, programmable theoretical framework.',
    changed:
      'Algorithms can be described independently of one particular physical experiment.',
    limit:
      'A universal model still needs suitable algorithms, physical implementation, and reliable operations.',
    bridge:
      'A variational model is one circuit family inside this framework, with angles chosen by a classical optimizer.',
    lessons: ['gates', 'learning', 'variational-classifier'],
    concepts: [
      {
        term: 'Universality',
        meaning:
          'The ability to approximate arbitrary allowed computations using a suitable set of operations.',
      },
      {
        term: 'Circuit',
        meaning:
          'An ordered description of state preparation, gates, and measurement.',
      },
    ],
    formulas: [
      {
        formula:
          '|\\psi_{\\mathrm{out}}\\rangle=U_k\\cdots U_2U_1|\\psi_{\\mathrm{in}}\\rangle',
        meaning:
          'A circuit composes gates. The rightmost gate acts first; measurement is a separate final step.',
      },
    ],
    sources: [references.deutsch],
    visual: 'circuit',
  },
  {
    id: 'physics-shor',
    year: 1994,
    track: 'physics',
    era: 'Quantum information',
    title: 'An algorithm gives a specific reason to expect speedup',
    short:
      'Shor shows polynomial-time quantum algorithms for factoring and discrete logarithms.',
    question:
      'Which problem benefits, and what makes the claim stronger than “quantum is powerful”?',
    answer: [
      'Peter Shor gave quantum algorithms for integer factoring and discrete logarithms whose running time grows polynomially with input size. The factoring algorithm uses a quantum period-finding procedure, connecting interference to an explicit mathematical problem.',
      'The result is an asymptotic improvement over the best known classical factoring algorithms. It is not a proof that no efficient classical factoring algorithm could exist. It also does not turn a variational classifier into a faster learner: each proposed QML advantage needs its own argument and comparison.',
    ],
    discovery:
      'Quantum algorithms obtain an explicit complexity improvement for important structured problems.',
    changed:
      'Quantum computing has a concrete algorithmic case, beyond general simulation arguments.',
    limit:
      'Large useful instances require long, reliable computations; algorithmic complexity and device readiness are different questions.',
    bridge:
      'When reading a QML paper, identify its problem, input access, output, and classical competitor just as carefully.',
    lessons: ['why', 'gates', 'quantum-kernels', 'practical-projects'],
    concepts: [
      {
        term: 'Input size',
        meaning:
          'The number of bits needed to write the integer, rather than the integer’s numerical value.',
      },
      {
        term: 'Asymptotic speedup',
        meaning:
          'An improvement in how computational cost grows as problems become larger.',
      },
    ],
    formulas: [
      {
        formula: 'f(a)=b^a\\bmod N',
        meaning:
          'Period finding for modular exponentiation is a central ingredient; b is chosen coprime to N.',
      },
    ],
    sources: [references.shor, references.shorExpanded],
    visual: 'circuit',
  },
  {
    id: 'physics-nobel-entanglement',
    year: 2022,
    track: 'physics',
    era: 'Quantum information',
    title: 'Decades of entanglement experiments are recognized',
    short:
      'The 2022 Nobel Prize honors Aspect, Clauser, and Zeilinger; the experiments happened across many earlier years.',
    question:
      'When did entanglement become experimental evidence and a practical resource?',
    answer: [
      'The 2022 Nobel Prize recognized experiments with entangled photons, Bell-inequality violations, and the development of quantum information science. Freedman and Clauser reported a Bell test in 1972; Aspect and collaborators developed important tests in 1981–1982. Zeilinger and collaborators later advanced entanglement experiments and quantum-information protocols.',
      'Separate experiments in 2015, including Hensen and colleagues’ electron-spin test, addressed major detection and locality loopholes together. The prize is a recognition date, rather than the year entanglement was discovered. The evidence rests on many experiments and teams.',
    ],
    discovery:
      'Controlled entanglement becomes both a tested quantum phenomenon and an information resource.',
    changed:
      'Questions about correlations connect to communication, state transfer, and experiments on quantum devices.',
    limit:
      'Bell violations do not enable faster-than-light messaging or guarantee a machine-learning advantage.',
    bridge:
      'Treat entanglement as a tool whose usefulness must be established for the particular learning task.',
    lessons: [
      'entanglement',
      'density-matrices',
      'noise',
      'quantum-state-learning',
    ],
    concepts: [
      {
        term: 'Loophole',
        meaning:
          'An experimental gap that could allow an alternative explanation under the tested assumptions.',
      },
      {
        term: 'Quantum information',
        meaning:
          'The study of information encoded, processed, and transmitted in quantum systems.',
      },
    ],
    sources: [references.nobel2022, references.aspect, references.hensen],
    visual: 'entanglement',
  },
];
