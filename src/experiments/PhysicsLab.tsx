import { lazy, Suspense, useState } from 'react';
import { MathFormula } from '../components/Math';
import { Distribution, numberText, Range } from '../components/Outputs';
import { probabilities, qubit } from '../lib/quantum';
import {
  densityState,
  gaussianDensity,
  gaussianUncertainty,
  wellEigenstate,
  wellSuperpositionDensity,
} from '../lib/learning/extended-models';

const BlochSphere = lazy(() => import('../components/BlochSphere'));
type PhysicsKind =
  'wavefunctions' | 'potential-well' | 'spin' | 'density-matrices';

function DensityCurve({
  title,
  label,
  min,
  max,
  yMax,
  value,
  caption,
}: {
  title: string;
  label: string;
  min: number;
  max: number;
  yMax: number;
  value: (x: number) => number;
  caption: string;
}) {
  const xPixel = (x: number) => 48 + (480 * (x - min)) / (max - min);
  const yPixel = (y: number) => 165 - (125 * y) / yMax;
  const points = Array.from({ length: 201 }, (_, i) => {
    const x = min + ((max - min) * i) / 200;
    return `${xPixel(x)},${yPixel(value(x))}`;
  }).join(' ');
  return (
    <figure className="plot">
      <svg
        viewBox="0 0 570 215"
        role="img"
        aria-label={`${title}. Horizontal axis: ${label}, from ${min} to ${max}. Vertical axis: probability density, from 0 to ${yMax}. Numerical samples are available in the table below.`}
      >
        <text x="48" y="20">
          {title}
        </text>
        {[0, yMax / 2, yMax].map((y) => (
          <g key={y}>
            <line
              x1="48"
              x2="528"
              y1={yPixel(y)}
              y2={yPixel(y)}
              className="grid"
            />
            <text x="5" y={yPixel(y) + 4}>
              {numberText(y, 2)}
            </text>
          </g>
        ))}
        <line x1="48" x2="48" y1="40" y2="165" className="axis" />
        <polyline points={points} fill="none" className="model-line" />
        {[min, (min + max) / 2, max].map((x) => (
          <text key={x} x={xPixel(x)} y="185" textAnchor="middle">
            {numberText(x, 1)}
          </text>
        ))}
        <text x="288" y="207" textAnchor="middle">
          {label}
        </text>
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function WavefunctionLab() {
  const [sigma, setSigma] = useState(0.75);
  const uncertainty = gaussianUncertainty(sigma);
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Wavefunction and uncertainty laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">
          Physics lab · A particle spread across space
        </span>
        <h3>Squeeze position. Spread momentum.</h3>
        <p>
          A wavefunction assigns an amplitude to each position. Its squared
          magnitude is a probability density. Narrow this normalized Gaussian
          and its wave-number distribution becomes wider.
        </p>
      </div>
      <div className="preset-row">
        <button onClick={() => setSigma(0.25)}>Localize position</button>
        <button onClick={() => setSigma(1.5)}>Localize wave number</button>
        <button onClick={() => setSigma(0.75)}>Reset wavefunction</button>
      </div>
      <Range
        label="Position width σx"
        value={sigma}
        min={0.25}
        max={1.5}
        step={0.01}
        unit=""
        onChange={setSigma}
      />
      <div className="metrics" role="status">
        <div>
          <span>Position uncertainty σx</span>
          <strong data-testid="position-uncertainty">
            {numberText(uncertainty.position)}
          </strong>
        </div>
        <div>
          <span>Wave-number uncertainty σk</span>
          <strong data-testid="wave-number-uncertainty">
            {numberText(uncertainty.waveNumber)}
          </strong>
        </div>
        <div>
          <span>Product σx σk</span>
          <strong>{numberText(uncertainty.product)}</strong>
        </div>
      </div>
      <DensityCurve
        title="Position probability density |ψ(x)|²"
        label="Position x (dimensionless)"
        min={-5}
        max={5}
        yMax={1.7}
        value={(x) => gaussianDensity(x, sigma)}
        caption="The area under the entire position density is 1. A density can exceed 1; the probability of an interval is the area over that interval."
      />
      <DensityCurve
        title="Wave-number probability density |ψ̃(k)|²"
        label="Wave number k (dimensionless)"
        min={-8}
        max={8}
        yMax={1.3}
        value={(k) => gaussianDensity(k, uncertainty.waveNumber)}
        caption="The Fourier transform of this real Gaussian is also Gaussian. Both graphs show finite windows; the normalized distributions extend to infinity."
      />
      <MathFormula>{String.raw`\psi(x)=\frac{e^{-x^2/(4\sigma_x^2)}}{(2\pi\sigma_x^2)^{1/4}},\quad \sigma_k=\frac{1}{2\sigma_x},\quad \sigma_x\sigma_p=\frac{\hbar}{2}`}</MathFormula>
      <p className="live-explanation">
        This particular Gaussian saturates the uncertainty bound. Its mean
        position and mean wave number are both zero. We use dimensionless units
        with ℏ = 1, so p = k and σp = σk. Other states can have a larger
        uncertainty product.
      </p>
      <details>
        <summary>Inspect density samples</summary>
        <div className="table-scroll">
          <table>
            <caption>
              Probability densities at selected coordinates; these are not
              probabilities of individual points.
            </caption>
            <thead>
              <tr>
                <th scope="col">Coordinate</th>
                <th scope="col">Position density</th>
                <th scope="col">Wave-number density</th>
              </tr>
            </thead>
            <tbody>
              {[-2, -1, 0, 1, 2].map((coordinate) => (
                <tr key={coordinate}>
                  <th scope="row">{coordinate}</th>
                  <td>{numberText(gaussianDensity(coordinate, sigma), 6)}</td>
                  <td>
                    {numberText(
                      gaussianDensity(coordinate, uncertainty.waveNumber),
                      6,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="lab-note">
        Try this: make σx half as large. Before looking at the numbers, predict
        what happens to σk. This tradeoff comes from Fourier structure, even
        before anyone measures the particle.
      </p>
    </div>
  );
}

function PotentialWellLab() {
  const [n, setN] = useState(1);
  const [superposition, setSuperposition] = useState(false);
  const [phase, setPhase] = useState(0);
  const phaseRadians = (phase * Math.PI) / 180;
  const eigen = wellEigenstate(n, 0.5);
  const density = (x: number) =>
    superposition
      ? wellSuperpositionDensity(x, phaseRadians)
      : wellEigenstate(n, x).density;
  const groundEnergy = Math.PI ** 2 / 2;
  function reset() {
    setN(1);
    setSuperposition(false);
    setPhase(0);
  }
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Particle in a box laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">
          Physics lab · Boundary conditions create energy levels
        </span>
        <h3>The particle in a one-dimensional box</h3>
        <p>
          Perfectly confining walls force the wavefunction to vanish at both
          ends. Only specific standing waves fit. Each allowed wave has its own
          energy.
        </p>
      </div>
      <div className="preset-row">
        <button
          aria-pressed={!superposition}
          onClick={() => setSuperposition(false)}
        >
          One energy eigenstate
        </button>
        <button
          aria-pressed={superposition}
          onClick={() => setSuperposition(true)}
        >
          Combine n = 1 and n = 2
        </button>
        <button onClick={reset}>Reset box</button>
      </div>
      {!superposition ? (
        <Range
          label="Energy level n"
          value={n}
          min={1}
          max={4}
          unit=""
          onChange={setN}
        />
      ) : (
        <Range
          label="Relative phase φ"
          value={phase}
          min={0}
          max={360}
          unit="°"
          onChange={setPhase}
        />
      )}
      <div className="metrics" role="status">
        <div>
          <span>{superposition ? 'Mean energy / E₁' : 'Energy / E₁'}</span>
          <strong data-testid="box-energy">
            {superposition ? '2.5000' : numberText(n ** 2)}
          </strong>
        </div>
        <div>
          <span>
            {superposition ? 'Relative phase (rad)' : 'Interior nodes of ψ'}
          </span>
          <strong>{superposition ? numberText(phaseRadians) : n - 1}</strong>
        </div>
        <div>
          <span>Density at x = 0.5</span>
          <strong data-testid="box-center-density">
            {numberText(density(0.5))}
          </strong>
        </div>
      </div>
      <DensityCurve
        title={
          superposition
            ? 'Two-state probability density'
            : `Probability density for n = ${n}`
        }
        label="Position x / L"
        min={0}
        max={1}
        yMax={superposition ? 4 : 2.2}
        value={density}
        caption={
          superposition
            ? 'Equal amplitudes in the first two energy levels. The interference term changes with relative phase, while normalization and the mean energy stay fixed.'
            : 'The density has n lobes and n − 1 interior nodes. It stays fixed in time for a single energy eigenstate.'
        }
      />
      <figure className="plot">
        <svg
          viewBox="0 0 570 230"
          role="img"
          aria-label="Four allowed energies, measured in ground-state units: n equals 1, 2, 3, 4 have energies 1, 4, 9, 16. Selected energy levels are amber."
        >
          <text x="30" y="20">
            Allowed energies (E / E₁)
          </text>
          {[1, 2, 3, 4].map((level) => (
            <g key={level}>
              <line
                x1="110"
                x2="480"
                y1={200 - level ** 2 * 10}
                y2={200 - level ** 2 * 10}
                stroke={
                  superposition
                    ? level <= 2
                      ? 'var(--amber)'
                      : 'var(--line)'
                    : level === n
                      ? 'var(--amber)'
                      : 'var(--line)'
                }
                strokeWidth="3"
              />
              <text x="35" y={204 - level ** 2 * 10}>
                n = {level}
              </text>
              <text x="495" y={204 - level ** 2 * 10}>
                {level ** 2}
              </text>
            </g>
          ))}
        </svg>
        <figcaption>
          Higher levels are spaced farther apart: Eₙ is proportional to n².
        </figcaption>
      </figure>
      <MathFormula>{String.raw`\psi_n(x)=\sqrt{\frac{2}{L}}\sin\!\left(\frac{n\pi x}{L}\right),\qquad E_n=\frac{n^2\pi^2\hbar^2}{2mL^2}`}</MathFormula>
      {superposition && (
        <MathFormula>{String.raw`|\psi(x,t)|^2=\tfrac12\psi_1^2+\tfrac12\psi_2^2+\psi_1\psi_2\cos\varphi,\quad\varphi=\frac{(E_2-E_1)t}{\hbar}`}</MathFormula>
      )}
      <p className="live-explanation">
        {superposition
          ? `Moving the phase slider represents time evolution through one beating period. At the current phase ${phase}°, the two energy components can reinforce in one region and cancel in another. The mean energy is (E₁ + E₂)/2; the state has no single definite energy.`
          : `For n = ${n}, the energy is ${numberText(eigen.energy)} in units where ℏ = m = L = 1. An overall phase e^(−iEₙt/ℏ) changes the wavefunction, but cancels when you compute |ψ|².`}
      </p>
      <details>
        <summary>Inspect the wavefunction and density</summary>
        <div className="table-scroll">
          <table>
            <caption>
              {superposition
                ? 'The two real basis functions and their combined density.'
                : 'A negative wavefunction amplitude still gives a nonnegative probability density.'}
            </caption>
            <thead>
              <tr>
                <th scope="col">x / L</th>
                {superposition ? (
                  <>
                    <th scope="col">ψ₁</th>
                    <th scope="col">ψ₂</th>
                  </>
                ) : (
                  <th scope="col">ψₙ</th>
                )}
                <th scope="col">Density</th>
              </tr>
            </thead>
            <tbody>
              {[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].map((x) => (
                <tr key={x}>
                  <th scope="row">{numberText(x, 3)}</th>
                  {superposition ? (
                    <>
                      <td>{numberText(wellEigenstate(1, x).amplitude)}</td>
                      <td>{numberText(wellEigenstate(2, x).amplitude)}</td>
                    </>
                  ) : (
                    <td>{numberText(wellEigenstate(n, x).amplitude)}</td>
                  )}
                  <td>{numberText(density(x))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="lab-note">
        Model assumptions: one particle, one spatial dimension, infinite walls,
        and a flat zero potential inside. Real traps can have finite barriers
        and different energy spacings. Here E₁ = {numberText(groundEnergy)} in
        the chosen units.
      </p>
    </div>
  );
}

function SpinLab() {
  const [theta, setTheta] = useState(90);
  const [phi, setPhi] = useState(0);
  const [viewVersion, setViewVersion] = useState(0);
  const state = qubit((theta * Math.PI) / 180, (phi * Math.PI) / 180);
  const z = probabilities(state, ['Z']);
  const x = probabilities(state, ['X']);
  function preset(t: number, p: number) {
    setTheta(t);
    setPhi(p);
  }
  function reset() {
    preset(90, 0);
    setViewVersion((value) => value + 1);
  }
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Spin measurement laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">
          Physics lab · One state, two measurement axes
        </span>
        <h3>Spin outcomes depend on what you measure</h3>
        <p>
          Prepare a spin-½ state, then compare ideal measurements of Sᶻ and Sˣ
          on separate copies. Each measurement has only two possible results,
          +ℏ/2 and −ℏ/2.
        </p>
      </div>
      <div className="preset-row">
        <button onClick={() => preset(0, 0)}>Certain +Z</button>
        <button onClick={() => preset(90, 0)}>Certain +X</button>
        <button onClick={() => preset(90, 180)}>Certain −X</button>
        <button onClick={reset}>Reset spin</button>
      </div>
      <Range
        label="Spin polar angle θ"
        value={theta}
        min={0}
        max={180}
        unit="°"
        onChange={setTheta}
      />
      <Range
        label="Spin relative phase φ"
        value={phi}
        min={0}
        max={359}
        unit="°"
        onChange={setPhi}
      />
      <Suspense
        fallback={
          <p>
            Loading the mathematical state picture. All measurement
            probabilities are shown below.
          </p>
        }
      >
        <BlochSphere key={viewVersion} state={state} />
      </Suspense>
      <Distribution
        probabilities={z}
        labels={['+ℏ/2', '−ℏ/2']}
        title="Measure Z on fresh preparations"
      />
      <Distribution
        probabilities={x}
        labels={['+ℏ/2', '−ℏ/2']}
        title="Measure X on fresh preparations"
      />
      <MathFormula>{String.raw`P(+Z)=\frac{1+\cos\theta}{2},\qquad P(+X)=\frac{1+\sin\theta\cos\varphi}{2}`}</MathFormula>
      <p className="live-explanation" role="status">
        For this preparation, P(+Z) = {(100 * z[0]).toFixed(2)}% and P(+X) ={' '}
        {(100 * x[0]).toFixed(2)}%. Changing φ at fixed θ leaves the Z
        probabilities fixed, but can change the X probabilities. These are
        comparisons across identically prepared copies, not two successive
        measurements of one particle.
      </p>
      <p className="lab-note">
        The Bloch arrow is a mathematical representation of the state. Spin is
        intrinsic angular momentum; this drawing does not depict a tiny ball
        spinning in physical space. A Z measurement prepares a Z eigenstate and
        can change the outcome statistics of a later X measurement.
      </p>
    </div>
  );
}

function DensityLab() {
  const [radius, setRadius] = useState(1);
  const [theta, setTheta] = useState(90);
  const state = densityState(radius, (theta * Math.PI) / 180, 0);
  function preset(r: number, t: number) {
    setRadius(r);
    setTheta(t);
  }
  const tip = { x: 285 + 100 * state.x, y: 135 - 100 * state.z };
  const off = numberText(state.offDiagonal.re);
  return (
    <div
      className="experiment"
      role="region"
      aria-label="Density matrix laboratory"
    >
      <div className="experiment-heading">
        <span className="eyebrow">
          Physics lab · Pure states and statistical mixtures
        </span>
        <h3>Inside the Bloch sphere</h3>
        <p>
          A density matrix describes both pure states and mixtures. A pure qubit
          lies on the surface; mixing the two opposite states shortens its Bloch
          vector toward the center.
        </p>
      </div>
      <div className="preset-row">
        <button onClick={() => preset(1, 90)}>Pure |+⟩</button>
        <button onClick={() => preset(0, 90)}>Maximally mixed</button>
        <button onClick={() => preset(1, 0)}>Pure |0⟩</button>
        <button onClick={() => preset(1, 90)}>Reset density matrix</button>
      </div>
      <Range
        label="Bloch vector length r"
        value={radius}
        min={0}
        max={1}
        step={0.01}
        unit=""
        onChange={setRadius}
      />
      <Range
        label="Density direction θ"
        value={theta}
        min={0}
        max={180}
        unit="°"
        onChange={setTheta}
      />
      <div className="metrics" role="status">
        <div>
          <span>Purity Tr(ρ²)</span>
          <strong data-testid="density-purity">
            {numberText(state.purity)}
          </strong>
        </div>
        <div>
          <span>Largest eigenvalue</span>
          <strong>{numberText(state.eigenvalues[0])}</strong>
        </div>
        <div>
          <span>Smallest eigenvalue</span>
          <strong>{numberText(state.eigenvalues[1])}</strong>
        </div>
      </div>
      <figure className="lab-visual">
        <svg
          viewBox="0 0 570 275"
          role="img"
          aria-label={`The x-z cross-section of the Bloch ball, with y = 0. Bloch vector x ${numberText(state.x)}, z ${numberText(state.z)}, length ${numberText(radius)}.`}
        >
          <circle
            cx="285"
            cy="135"
            r="100"
            fill="#172d4c"
            stroke="var(--teal)"
            strokeOpacity="0.6"
          />
          <line
            x1="165"
            x2="405"
            y1="135"
            y2="135"
            stroke="currentColor"
            opacity="0.4"
          />
          <line
            x1="285"
            x2="285"
            y1="20"
            y2="250"
            stroke="currentColor"
            opacity="0.4"
          />
          <text x="413" y="140" fill="currentColor">
            +x
          </text>
          <text x="294" y="23" fill="currentColor">
            +z · |0⟩
          </text>
          <text x="294" y="257" fill="currentColor">
            −z · |1⟩
          </text>
          <line
            x1="285"
            x2={tip.x}
            y1="135"
            y2={tip.y}
            stroke="var(--amber)"
            strokeWidth="4"
          />
          <circle cx={tip.x} cy={tip.y} r="6" fill="var(--amber)" />
          <circle cx="285" cy="135" r="3" fill="currentColor" />
        </svg>
        <figcaption>
          An x–z cross-section of the mathematical Bloch ball, restricted to y =
          0. Radius 1 means pure; radius 0 means maximally mixed.
        </figcaption>
      </figure>
      <MathFormula>{`\\rho=\\begin{pmatrix}${numberText(state.diagonal[0])}&${off}\\\\${off}&${numberText(state.diagonal[1])}\\end{pmatrix},\\qquad \\operatorname{Tr}(\\rho^2)=\\frac{1+r^2}{2}`}</MathFormula>
      <Distribution
        probabilities={state.diagonal}
        labels={['0', '1']}
        title="Z probabilities: diagonal entries of ρ"
      />
      <Distribution
        probabilities={[(1 + state.x) / 2, (1 - state.x) / 2]}
        labels={['+', '−']}
        title="X probabilities: coherence becomes visible"
      />
      <details>
        <summary>Inspect the density matrix and its eigenvalues</summary>
        <div className="table-scroll">
          <table>
            <caption>
              All entries are real in this x–z slice. The trace is 1 and both
              eigenvalues are nonnegative.
            </caption>
            <thead>
              <tr>
                <th scope="col">Quantity</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">ρ₀₀</th>
                <td>{numberText(state.diagonal[0])}</td>
              </tr>
              <tr>
                <th scope="row">ρ₀₁ = ρ₁₀</th>
                <td>{off}</td>
              </tr>
              <tr>
                <th scope="row">ρ₁₁</th>
                <td>{numberText(state.diagonal[1])}</td>
              </tr>
              <tr>
                <th scope="row">λ₊</th>
                <td>{numberText(state.eigenvalues[0])}</td>
              </tr>
              <tr>
                <th scope="row">λ₋</th>
                <td>{numberText(state.eigenvalues[1])}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
      <p className="live-explanation">
        {radius === 1
          ? 'This state is pure: one eigenvalue is 1 and the other is 0. It can be described by a single state vector.'
          : radius === 0
            ? 'This is ρ = I/2. Every spin measurement axis gives equal probabilities. No single pure-state vector represents it.'
            : `This mixture has purity ${numberText(state.purity)}. It equals a mixture of the pure states along and opposite the arrow, weighted ${numberText(state.eigenvalues[0])} and ${numberText(state.eigenvalues[1])}.`}
      </p>
      <p className="lab-note">
        Compare “Pure |+⟩” and “Maximally mixed.” Both give 50/50 in Z. In X,
        the pure state gives a certain + result and the mixture stays 50/50.
        Matching one probability distribution does not establish that two
        quantum states are identical.
      </p>
    </div>
  );
}

export default function PhysicsLab({ kind }: { kind: PhysicsKind }) {
  if (kind === 'wavefunctions') return <WavefunctionLab />;
  if (kind === 'potential-well') return <PotentialWellLab />;
  if (kind === 'spin') return <SpinLab />;
  return <DensityLab />;
}
