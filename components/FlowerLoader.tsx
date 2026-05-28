export function FlowerLoader() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-rose-cloud/85 backdrop-blur-sm rounded-[28px]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 animate-spin-slow">
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl animate-counter-spin select-none"
            style={{ filter: "drop-shadow(0 2px 4px rgba(255, 119, 168, 0.4))" }}
          >
            🌸
          </span>
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl animate-counter-spin select-none"
            style={{ filter: "drop-shadow(0 2px 4px rgba(255, 119, 168, 0.4))" }}
          >
            🌷
          </span>
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-3xl animate-counter-spin select-none"
            style={{ filter: "drop-shadow(0 2px 4px rgba(255, 119, 168, 0.4))" }}
          >
            🌺
          </span>
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl animate-counter-spin select-none"
            style={{ filter: "drop-shadow(0 2px 4px rgba(255, 119, 168, 0.4))" }}
          >
            ✿
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl text-rose-deep animate-heart-beat select-none">
          ♡
        </div>
      </div>
      <p className="font-body text-sm text-plum-soft animate-pulse">
        cargando ♡
      </p>
    </div>
  );
}
