import { copy } from '../../content/copy';

export function Footer() {
  return (
    <footer id="sec-12" className="relative z-10 px-6 md:px-10 pt-16 pb-14 border-t border-ink/10">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <p className="font-display text-2xl tracking-[0.18em] text-ink">{copy.footer.title}</p>
            <p className="mt-6 text-ink/75 max-w-copy">{copy.footer.close}</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-3">Team</p>
            <p className="text-ink">{copy.team.group}</p>
            <ul className="mt-1 text-[0.9rem] text-muted">
              {copy.team.members.map((m) => <li key={m}>{m}</li>)}
            </ul>
            <p className="mt-4 text-[0.9rem] text-ink">Guide</p>
            <p className="text-[0.9rem] text-muted">{copy.team.guide}</p>
            <p className="mt-4 text-[0.78rem] uppercase tracking-[0.22em] text-muted">{copy.team.year}</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-3">Links</p>
            <ul className="space-y-1">
              {copy.footer.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-ink hover:text-accent transition-colors duration-500 ease-soft"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rule mt-14" />
        <p className="mt-6 text-[0.78rem] text-muted">
          Guidance, not medical advice. Built as a student project with care.
        </p>
      </div>
    </footer>
  );
}
