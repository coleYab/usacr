import { Clock, Flame } from 'lucide-react';
import { useCountdown } from '@/hooks/use-countdown';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CountdownBadgeProps = {
    targetDate: string;
    isClosed?: boolean;
    className?: string;
};

export function CountdownBadge({
    targetDate,
    isClosed = false,
    className,
}: CountdownBadgeProps) {
    const { formatted, isExpired, isUrgent, isEndingSoon } =
        useCountdown(targetDate);

    if (isClosed || isExpired) {
        return (
            <Badge
                variant="outline"
                className={cn(
                    'bg-muted/80 text-muted-foreground border-transparent text-xs font-medium',
                    className,
                )}
            >
                <Clock className="mr-1 size-3" />
                Ended
            </Badge>
        );
    }

    if (isUrgent) {
        return (
            <Badge
                variant="outline"
                className={cn(
                    'bg-destructive/15 text-destructive border-destructive/30 animate-pulse text-xs font-semibold',
                    className,
                )}
            >
                <Flame className="text-destructive mr-1 size-3" />
                {formatted} left
            </Badge>
        );
    }

    if (isEndingSoon) {
        return (
            <Badge
                variant="outline"
                className={cn(
                    'border-amber-500/30 bg-amber-500/15 text-xs font-medium text-amber-600 dark:text-amber-400',
                    className,
                )}
            >
                <Clock className="mr-1 size-3" />
                {formatted} left
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className={cn(
                'bg-background/80 text-foreground border-border text-xs font-medium backdrop-blur-xs',
                className,
            )}
        >
            <Clock className="text-muted-foreground mr-1 size-3" />
            {formatted} left
        </Badge>
    );
}
