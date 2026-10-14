import { useScrollY } from '../../lib/scroll';

export function ScrollProgress() {
  const y = useScrollY();
  return (
    <div className="fixed top-0 inset-x-0 h-[2px] z-50 bg-transparent">
      <span className="block h-full bg-accent" style={{ width: `${y * 100}%` }} />
    </div>
  );
}
