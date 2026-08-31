import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
};

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center',
                className,
            )}
        >
            <div className="bg-muted flex size-12 items-center justify-center rounded-lg">
                <Icon className="text-muted-foreground size-6" />
            </div>
            <div className="space-y-1">
                <p className="text-base font-semibold tracking-tight">
                    {title}
                </p>
                {description && (
                    <p className="text-muted-foreground mx-auto max-w-sm text-sm">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}
