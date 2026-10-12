import '../styles/repository-link.css';

export default function RepositoryLink() {
  return (
    <a
      className="repository-link"
      href="https://github.com/oguzhankir/quantum-machine-learning-playground"
      target="_blank"
      rel="noreferrer"
      aria-label="Quantum ML Playground on GitHub (opens in a new tab)"
      title="Explore the source. If it is useful, you can leave a star on GitHub."
    >
      <svg
        className="repository-link-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.62 1.22 3.26.93.1-.73.4-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.83 10.83 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
      </svg>
      <span className="repository-link-label">GitHub</span>
      <span className="repository-link-invitation" aria-hidden="true">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          focusable="false"
        >
          <path d="m8 1.5 2 4.1 4.5.6-3.3 3.2.8 4.6L8 11.8l-4 2.2.8-4.6L1.5 6.2l4.5-.6Z" />
        </svg>
        Star if useful
      </span>
    </a>
  );
}
