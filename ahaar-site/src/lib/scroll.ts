import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisSingleton: Lenis | null = null;

/** Install Lenis once; keep ScrollTrigger in sync. */
export function initSmoothScroll(disabled = false): Lenis | null {
  if (disabled || typeof window === 'undefined' || lenisSingleton) return lenisSingleton;
  const lenis = new Lenis({
    lerp: 0.11,
    duration: 1.1,
    wheelMultiplier: 1,
    smoothWheel: true,
  });
  lenisSingleton = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
}

/** Observe window scroll position as a normalised [0..1] value. */
export function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setY(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}
