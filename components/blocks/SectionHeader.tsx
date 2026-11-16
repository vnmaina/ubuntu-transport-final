interface SectionHeaderProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, className = "" }: SectionHeaderProps) {
  if (!title && !subtitle && !eyebrow) return null;

  return (
    <div className={`mx-auto max-w-3xl space-y-5 text-center ${className}`}>
      {eyebrow && (
        <div className="flex items-center justify-center gap-2">
          <span className="h-1 w-7 rounded-full bg-secondary" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </span>
          <span className="h-1 w-7 rounded-full bg-secondary" />
        </div>
      )}

      {title && (
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="mx-auto max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}

      <div className="mx-auto h-1 w-16 rounded-full bg-secondary" />
    </div>
  );
}
