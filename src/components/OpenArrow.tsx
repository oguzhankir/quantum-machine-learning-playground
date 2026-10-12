/** Draw the opening indicator explicitly instead of relying on font glyphs. */
export default function OpenArrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 15 15 5M5 5h10v10" />
    </svg>
  );
}
