import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LotteryStatus } from '@/types';

const styles: Record<LotteryStatus, string> = {
    draft: 'border-transparent bg-muted text-muted-foreground',
    active: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    completed:
        'border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400',
    cancelled: 'border-transparent bg-destructive/10 text-destructive',
};

export function LotteryStatusBadge({
    status,
    label,
    className,
}: {
    status: LotteryStatus;
    label?: string;
    className?: string;
}) {
    return (
        <Badge
            variant="outline"
            className={cn('font-medium capitalize', styles[status], className)}
        >
            {label ?? status}
        </Badge>
    );
}
