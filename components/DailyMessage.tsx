type Props = { message: string };

export function DailyMessage({ message }: Props) {
  if (!message) return null;
  return (
    <p
      className="font-display text-2xl sm:text-3xl text-shimmer animate-bob text-center"
      style={{ animationDelay: "0.4s" }}
    >
      ♡ {message} ♡
    </p>
  );
}
