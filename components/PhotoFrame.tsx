"use client";

import Image from "next/image";
import { useState } from "react";
import { Bow } from "./Bow";
import { FlowerLoader } from "./FlowerLoader";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function PhotoFrame({ src, alt, width, height }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative animate-fade-up">
      <div className="absolute left-1/2 -top-10 -translate-x-1/2 z-20 animate-wiggle">
        <Bow size={96} />
      </div>

      <div
        className="relative rounded-[36px] bg-white p-3 sm:p-4"
        style={{ boxShadow: "var(--shadow-kawaii-lg)" }}
      >
        <div
          className="relative rounded-[28px] overflow-hidden bg-rose-soft mx-auto flex items-center justify-center"
          style={{ minHeight: 300, minWidth: 240 }}
        >
          {!loaded && <FlowerLoader />}
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority
            unoptimized
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={`block max-w-full max-h-[80dvh] w-auto h-auto object-contain transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <span className="absolute -top-2 -left-2 text-2xl select-none" aria-hidden>♡</span>
        <span className="absolute -top-2 -right-2 text-2xl select-none" aria-hidden>♡</span>
        <span className="absolute -bottom-2 -left-2 text-xl select-none" aria-hidden>✿</span>
        <span className="absolute -bottom-2 -right-2 text-xl select-none" aria-hidden>✿</span>
      </div>
    </div>
  );
}
