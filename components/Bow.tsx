type Props = { className?: string; size?: number };

export function Bow({ className = "", size = 88 }: Props) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 100 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="bowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff8fc0" />
          <stop offset="100%" stopColor="#ff4b8b" />
        </linearGradient>
      </defs>
      <path
        d="M50 35 C 30 10, 5 15, 8 35 C 5 55, 30 60, 50 35 Z"
        fill="url(#bowGrad)"
        stroke="#ff2f7a"
        strokeWidth="1.5"
      />
      <path
        d="M50 35 C 70 10, 95 15, 92 35 C 95 55, 70 60, 50 35 Z"
        fill="url(#bowGrad)"
        stroke="#ff2f7a"
        strokeWidth="1.5"
      />
      <ellipse cx="50" cy="35" rx="8" ry="10" fill="#ff2f7a" />
      <ellipse cx="48" cy="32" rx="2.5" ry="3.5" fill="#ffd1e3" opacity="0.8" />
      <path
        d="M45 44 C 42 55, 38 62, 35 68"
        stroke="#ff2f7a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 44 C 58 55, 62 62, 65 68"
        stroke="#ff2f7a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
