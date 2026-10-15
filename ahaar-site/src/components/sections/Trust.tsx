import { copy } from '../../content/copy';
import { IconLock, IconShield, IconLeaf } from '../ui/icons';

/**
 * Trust and privacy. Three short lines with custom line icons.
 * No scroll animation here — plain and specific wins.
 */
const ICONS = [IconLock, IconShield, IconLeaf];

export function Trust() {
  return (
    <section id="sec-11" className="relative z-10 py-32 px-6 md:px-10 border-t border-ink/10 mt-10">
      <div className="max-w-[1120px] mx-auto">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-10">{copy.trust.kicker}</p>
        <ul className="grid md:grid-cols-3 gap-8">
          {copy.trust.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <li key={it.title} className="flex gap-4">
                <Icon width="26" height="26" className="text-ink shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-[1.15rem] text-ink">{it.title}</h3>
                  <p className="mt-1 text-[0.95rem] text-ink/75 max-w-copy">{it.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 text-[0.85rem] text-muted italic">{copy.trust.note}</p>
      </div>
    </section>
  );
}
