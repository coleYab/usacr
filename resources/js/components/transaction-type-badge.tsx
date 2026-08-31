import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function TransactionTypeBadge({
    isCredit,
    label,
}: {
    isCredit: boolean;
    label: string;
}) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'font-medium',
                isCredit
                    ? 'bg-primary/10 text-primary border-transparent'
                    : 'bg-destructive/10 text-destructive border-transparent',
            )}
        >
            {label}
        </Badge>
    );
}
