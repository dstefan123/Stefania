import { Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950">
        <Dumbbell className="h-5 w-5 text-accent-400" strokeWidth={2.5} />
      </div>
      {showText && (
        <div className="leading-none">
          <span className="font-display text-lg uppercase tracking-wider text-ink-900">Stefania Moraru</span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-ink-400">Fitness Trainer</span>
        </div>
      )}
    </div>
  );
}
