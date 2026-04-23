import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  iconContainerClassName?: string;
}

const SectionCard = ({
  title,
  icon,
  children,
  className,
  iconContainerClassName
}: SectionCardProps) => {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-sm',
        className
      )}
    >
      <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold text-card-foreground">
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20',
            iconContainerClassName
          )}
        >
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
};

export default SectionCard;
