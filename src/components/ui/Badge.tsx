import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { BookingStatus, SubscriptionStatus, ClientStatus } from '@/types';

type BadgeVariant = 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

const styles: Record<BadgeVariant, string> = {
  accent: 'badge-accent',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  neutral: 'badge-neutral',
};

export function Badge({ variant = 'neutral', children }: { variant?: BadgeVariant; children: ReactNode }) {
  return <span className={styles[variant]}>{children}</span>;
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, { variant: BadgeVariant; label: string }> = {
    scheduled: { variant: 'accent', label: 'Programată' },
    completed: { variant: 'success', label: 'Finalizată' },
    cancelled: { variant: 'neutral', label: 'Anulată' },
    no_show: { variant: 'danger', label: 'No-show' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const map: Record<SubscriptionStatus, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Activ' },
    paused: { variant: 'warning', label: 'Suspendat' },
    expired: { variant: 'danger', label: 'Expirat' },
    suspended: { variant: 'warning', label: 'Suspendat' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const map: Record<ClientStatus, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Activ' },
    paused: { variant: 'warning', label: 'Suspendat' },
    inactive: { variant: 'neutral', label: 'Inactiv' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
