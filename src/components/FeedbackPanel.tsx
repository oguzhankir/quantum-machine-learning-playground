import '../styles/feedback.css';

const feedbackEmail = 'oguzhankir17@gmail.com';
export const feedbackHref = `mailto:${feedbackEmail}?subject=Quantum%20ML%20Playground%20feedback`;

export default function FeedbackPanel() {
  return (
    <section
      id="feedback"
      className="feedback-panel"
      aria-labelledby="feedback-heading"
    >
      <div className="feedback-card">
        <div className="feedback-copy">
          <p className="feedback-eyebrow">
            A PROJECT THAT GROWS WITH CURIOSITY
          </p>
          <h2 id="feedback-heading">Help make the next explanation clearer.</h2>
          <p>
            This is a personal learning project. If an explanation is unclear,
            something breaks, or you have an experiment idea, I’d love to hear
            from you.
          </p>
          <ul
            className="feedback-prompts"
            aria-label="Helpful details to include"
          >
            <li>
              <span aria-hidden="true">01</span>What were you reading?
            </li>
            <li>
              <span aria-hidden="true">02</span>Where did you get stuck?
            </li>
            <li>
              <span aria-hidden="true">03</span>What would make it clearer?
            </li>
          </ul>
        </div>
        <div className="feedback-actions">
          <a className="button primary feedback-send" href={feedbackHref}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 7 8 6 8-6" strokeLinejoin="round" />
            </svg>
            Send feedback
          </a>
          <a className="feedback-email" href={feedbackHref}>
            {feedbackEmail}
          </a>
        </div>
      </div>
    </section>
  );
}
