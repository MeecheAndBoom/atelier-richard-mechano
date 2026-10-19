"use client";

import { useEffect, useState } from "react";

/**
 * Hero background built from real spare-part photography.
 * Crossfades through the images with a slow Ken Burns drift, so it reads as an
 * animated fade-in video without shipping an unrelated stock clip.
 * Respects prefers-reduced-motion (falls back to the first still).
 */
const FRAMES = [
  "/images/editorial/atelier.jpg",
  "/images/products/alternator.jpg",
  "/images/products/brake-disc.jpg",
  "/images/products/timing-kit.jpg",
  "/images/products/water-pump.jpg",
  "/images/editorial/hero.jpg",
];

const FRAME_MS = 5000;

export function HeroBackground() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced || FRAMES.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % FRAMES.length);
    }, FRAME_MS);
    return () => clearInterval(timer);
  }, [reduced]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {FRAMES.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className={`h-full w-full object-cover ${
              reduced ? "" : "hero-kenburns"
            }`}
            style={{ animationDelay: `${-i * 1.5}s` }}
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
    </div>
  );
}
