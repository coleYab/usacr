import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
    pending: 'border-transparent bg-muted text-muted-foreground',
    approved: 'border-transparent bg-primary/10 text-primary',
    rejected: 'border-transparent bg-destructive/10 text-destructive',
};

export function DepositStatusBadge({
    status,
    label,
}: {
    status: string;
    label?: string;
}) {
    return (
        <Badge variant="outline" className={cn('font-medium', styles[status])}>
            {label ?? status}
        </Badge>
    );
}
