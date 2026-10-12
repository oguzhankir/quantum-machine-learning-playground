import { useEffect, useRef, useState } from 'react';
import '../styles/wave-video.css';

export const waveClips = {
  motion: {
    title: 'Watch the ripples and floating cork',
    description:
      'Follow the ripples on the surface, then the floating cork. Compare their motion with the fixed-position model above.',
    source: `${import.meta.env.BASE_URL}media/waves/moving-pattern.mp4`,
    poster: `${import.meta.env.BASE_URL}media/waves/moving-pattern.webp`,
  },
  overlap: {
    title: 'Watch ripples meet',
    description:
      'Ripples from nearby sources spread into the same area. Look at the overlapping surface patterns, then compare them with the addition diagram above.',
    source:
      'https://v3b.fal.media/files/b/0aae20a3/Xj58qkErVBgJKZDEFQh28_minimax-h3.mp4',
    poster: `${import.meta.env.BASE_URL}media/waves/overlapping-ripples.webp`,
  },
};

export default function WaveVideo({ clip }: { clip: keyof typeof waveClips }) {
  const data = waveClips[clip];
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    return () => video?.pause();
  }, [open, failed]);

  return (
    <details
      className="wave-video"
      onToggle={(event) => {
        const expanded = event.currentTarget.open;
        if (!expanded) videoRef.current?.pause();
        setOpen(expanded);
      }}
    >
      <summary>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
          <path d="M10 7.5 17 12l-7 4.5Z" fill="currentColor" />
        </svg>
        <span>
          <strong>{data.title}</strong>
          <small>Optional water illustration · about 5 seconds</small>
        </span>
        <span className="wave-video-chevron" aria-hidden="true">
          ⌄
        </span>
      </summary>
      {open && (
        <div className="wave-video-content">
          {failed ? (
            <div className="wave-video-fallback" role="status">
              <p>
                This clip could not load. You can keep learning with the
                measured diagrams above.
              </p>
              <button onClick={() => setFailed(false)}>
                Show the player again
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              controls
              muted
              playsInline
              preload="none"
              poster={data.poster}
              src={data.source}
              aria-label={data.title}
              onError={() => setFailed(true)}
            >
              Your browser does not support this video. The measured diagrams
              above explain the same ideas.
            </video>
          )}
          <p>{data.description}</p>
          <p className="wave-video-note">
            AI-generated illustration, not a recorded experiment. Use the
            diagrams for exact measurements and predictions.
          </p>
        </div>
      )}
    </details>
  );
}
