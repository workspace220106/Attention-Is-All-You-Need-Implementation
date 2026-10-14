import { useEffect, useState } from 'react';

export function ScrollHint() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 60) setHidden(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-muted transition-opacity duration-700 ease-soft ${hidden ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden="true"
    >
      <span className="text-[0.7rem] uppercase tracking-[0.22em]">Scroll</span>
      <span className="block w-[1px] h-10 bg-ink/30 relative overflow-hidden">
        <span className="absolute inset-x-0 top-0 h-3 bg-accent animate-[hint_1.8s_ease-in-out_infinite]" />
      </span>
      <style>{`@keyframes hint { 0% { transform: translateY(-100%);} 60%{ transform: translateY(260%);} 100%{ transform: translateY(260%);} }`}</style>
    </div>
  );
}
