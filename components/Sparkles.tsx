const decorations = [
  { emoji: "✨", top: "8%", left: "6%", size: "text-3xl", delay: "0s" },
  { emoji: "♡", top: "14%", right: "8%", size: "text-2xl", delay: "0.6s" },
  { emoji: "🎀", top: "30%", left: "3%", size: "text-2xl", delay: "1.2s" },
  { emoji: "✨", top: "60%", right: "5%", size: "text-3xl", delay: "0.3s" },
  { emoji: "♡", top: "75%", left: "8%", size: "text-xl", delay: "1.8s" },
  { emoji: "✿", top: "20%", right: "20%", size: "text-2xl", delay: "0.9s" },
  { emoji: "✨", top: "85%", right: "15%", size: "text-2xl", delay: "1.5s" },
  { emoji: "♡", top: "45%", left: "10%", size: "text-xl", delay: "2.1s" },
  { emoji: "🌸", top: "55%", right: "12%", size: "text-2xl", delay: "0.4s" },
  { emoji: "✿", top: "90%", left: "20%", size: "text-xl", delay: "1.1s" },
] as const;

export function Sparkles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
      {decorations.map((d, i) => (
        <span
          key={i}
          className={`absolute ${d.size} animate-sparkle select-none`}
          style={{
            top: d.top,
            left: "left" in d ? d.left : undefined,
            right: "right" in d ? d.right : undefined,
            animationDelay: d.delay,
            textShadow: "0 2px 8px rgba(255, 119, 168, 0.4)",
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}
