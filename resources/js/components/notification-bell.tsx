import { router, usePage } from '@inertiajs/react';
import { Bell, CheckCheck, Ticket, Trophy, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { markAllRead, read } from '@/routes/app/notifications';
import { cn } from '@/lib/utils';
import type { InAppNotification } from '@/types';

type NotificationSharedProps = {
    unreadCount: number;
    recent: InAppNotification[];
};

export function NotificationBell() {
    const page = usePage();
    const notifications = page.props
        .notifications as NotificationSharedProps | null;
    const [open, setOpen] = useState(false);

    const unreadCount = notifications?.unreadCount ?? 0;
    const items = notifications?.recent ?? [];

    // Background polling every 25 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['notifications'],
            });
        }, 25000);

        return () => clearInterval(interval);
    }, []);

    const handleMarkAllRead = () => {
        router.post(
            markAllRead.url(),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleNotificationClick = (item: InAppNotification) => {
        if (!item.read_at) {
            router.post(
                read.url({ id: item.id }),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
        setOpen(false);
        if (item.data.url) {
            router.visit(item.data.url);
        }
    };

    const renderIcon = (item: InAppNotification) => {
        const type = item.data.type || '';
        const isWinner = item.data.is_winner;

        if (isWinner) {
            return (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
                    <Trophy className="size-4" />
                </div>
            );
        }

        if (type.startsWith('lottery')) {
            return (
                <div className="bg-primary/15 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Ticket className="size-4" />
                </div>
            );
        }

        return (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <Wallet className="size-4" />
            </div>
        );
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative size-9 rounded-full"
                    aria-label="Open notifications"
                >
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground animate-in zoom-in-50 absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold shadow-xs">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-0 sm:w-96" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">Notifications</h4>
                        {unreadCount > 0 && (
                            <Badge
                                variant="secondary"
                                className="px-1.5 py-0 text-xs"
                            >
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllRead}
                            className="text-muted-foreground hover:text-foreground h-7 gap-1 text-xs"
                        >
                            <CheckCheck className="size-3.5" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="max-h-80">
                    {items.length > 0 ? (
                        <div className="divide-y">
                            {items.map((item) => {
                                const isUnread = !item.read_at;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            handleNotificationClick(item)
                                        }
                                        className={cn(
                                            'hover:bg-muted/60 flex w-full items-start gap-3 p-3.5 text-left transition-colors',
                                            isUnread &&
                                                'bg-muted/30 font-medium',
                                        )}
                                    >
                                        {renderIcon(item)}
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p
                                                    className={cn(
                                                        'line-clamp-1 text-xs',
                                                        isUnread
                                                            ? 'text-foreground font-semibold'
                                                            : 'text-muted-foreground font-normal',
                                                    )}
                                                >
                                                    {item.data.lottery_title ??
                                                        'Activity Alert'}
                                                </p>
                                                <span className="text-muted-foreground shrink-0 text-[10px]">
                                                    {item.created_at_diff}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                                                {item.data.message}
                                            </p>
                                        </div>
                                        {isUnread && (
                                            <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2 py-10 text-center">
                            <Bell className="text-muted-foreground/40 mx-auto size-8" />
                            <p className="text-muted-foreground text-xs">
                                You have no notifications yet.
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
