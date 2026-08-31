import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    delta?: {
        value: string;
        direction: 'up' | 'down';
    };
    className?: string;
};

export function StatCard({
    label,
    value,
    icon: Icon,
    delta,
    className,
}: StatCardProps) {
    const isUp = delta?.direction === 'up';

    return (
        <Card className={cn('overflow-hidden', className)}>
            <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="min-w-0">
                    <p className="text-muted-foreground text-sm">{label}</p>
                    <p className="mt-2 truncate font-mono text-2xl font-semibold tracking-tight">
                        {value}
                    </p>
                    {delta && (
                        <p
                            className={cn(
                                'mt-2 flex items-center gap-1 text-xs font-medium',
                                isUp ? 'text-primary' : 'text-destructive',
                            )}
                        >
                            {isUp ? (
                                <TrendingUp className="size-3.5" />
                            ) : (
                                <TrendingDown className="size-3.5" />
                            )}
                            {delta.value}
                        </p>
                    )}
                </div>
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-5" />
                </div>
            </CardContent>
        </Card>
    );
}
