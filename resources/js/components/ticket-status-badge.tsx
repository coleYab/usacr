import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TicketStatus } from '@/types';

const styles: Record<TicketStatus, string> = {
    active: 'border-transparent bg-primary/10 text-primary',
    won: 'border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold shadow-xs ring-1 ring-amber-500/20',
    lost: 'border-transparent bg-muted text-muted-foreground',
    refunded: 'border-transparent bg-destructive/10 text-destructive',
};

export function TicketStatusBadge({
    status,
    label,
    className,
}: {
    status: TicketStatus;
    label?: string;
    className?: string;
}) {
    const isWon = status === 'won';

    return (
        <Badge
            variant="outline"
            className={cn(
                'inline-flex items-center gap-1 font-medium capitalize',
                styles[status],
                className,
            )}
        >
            {isWon && <Trophy className="size-3 text-amber-500" />}
            {label ?? status}
        </Badge>
    );
}
