import { Badge } from '@/components/ui/badge';
import type { UserStatus } from '@/types';

type UserStatusBadgeProps = {
    status: UserStatus;
    className?: string;
};

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
    switch (status) {
        case 'active':
            return (
                <Badge
                    variant="outline"
                    className={`border-emerald-500/30 bg-emerald-500/10 text-emerald-600 capitalize dark:text-emerald-400 ${className ?? ''}`}
                >
                    Active
                </Badge>
            );
        case 'suspended':
            return (
                <Badge
                    variant="outline"
                    className={`border-amber-500/30 bg-amber-500/10 text-amber-600 capitalize dark:text-amber-400 ${className ?? ''}`}
                >
                    Suspended
                </Badge>
            );
        case 'banned':
            return (
                <Badge
                    variant="outline"
                    className={`border-destructive/30 bg-destructive/10 text-destructive capitalize ${className ?? ''}`}
                >
                    Banned
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className={`capitalize ${className ?? ''}`}
                >
                    {status}
                </Badge>
            );
    }
}
