function WaxSeal({ size = 130, opacity = 1 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ opacity }}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent-brass)" strokeWidth="1" />
      <path d="M50 18 L50 82 M28 40 L72 40 M35 30 L65 30" stroke="var(--accent-brass)" strokeWidth="1.5" fill="none" />
      <path d="M42 82 L50 94 L58 82" stroke="var(--accent-brass)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default WaxSeal;