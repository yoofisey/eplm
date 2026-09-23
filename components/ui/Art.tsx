type ArtProps = {
  label: string;
  seed?: string;
  className?: string;
};

const palettes: [string, string][] = [
  ["#4a5d45", "#1c2b27"],
  ["#6b2737", "#8a3a4e"],
  ["#b98d3e", "#d3a95e"],
  ["#1c2b27", "#6b2737"],
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function initialsOf(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function Art({ label, seed = "", className = "" }: ArtProps) {
  const [start, end] = palettes[hash(label + seed) % palettes.length];
  const initials = initialsOf(label);
  const uid = `art-${hash(label + seed).toString(36)}`;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={start} />
          <stop offset="100%" stopColor={end} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${uid})`} />
      <circle cx="340" cy="40" r="110" fill="#fff" opacity="0.06" />
      <circle cx="30" cy="280" r="140" fill="#fff" opacity="0.06" />
      {initials && (
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#f5efe1"
          fillOpacity="0.9"
          style={{ font: "600 84px Fraunces, Georgia, serif", letterSpacing: "0.04em" }}
        >
          {initials}
        </text>
      )}
    </svg>
  );
}