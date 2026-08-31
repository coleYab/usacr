import { Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Tag,
    Ticket,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CountdownBadge } from '@/components/countdown-badge';
import { show } from '@/routes/app/lotteries';
import { cn } from '@/lib/utils';
import type { LotteryRow } from '@/types';

export function LotteryCard({ lottery }: { lottery: LotteryRow }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const images =
        lottery.media && lottery.media.length > 0
            ? lottery.media
            : [
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
              ];

    const hasMultipleImages = images.length > 1;

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveImageIndex(
            (prev) => (prev - 1 + images.length) % images.length,
        );
    };

    const isClosed = !lottery.is_open || lottery.status !== 'active';

    return (
        <Card
            className={cn(
                'group hover:border-primary/40 relative flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md',
                isClosed && 'hover:border-border opacity-85',
            )}
        >
            {/* Image Header with Countdown & Badges */}
            <div className="bg-muted relative aspect-16/10 w-full overflow-hidden">
                <img
                    src={images[activeImageIndex]}
                    alt={lottery.title}
                    className={cn(
                        'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105',
                        isClosed && 'grayscale-[30%]',
                    )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Top Badges */}
                <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                    <CountdownBadge
                        targetDate={lottery.draw_at}
                        isClosed={isClosed}
                    />

                    {lottery.is_sold_out ? (
                        <Badge
                            variant="destructive"
                            className="font-semibold shadow-xs"
                        >
                            Sold Out
                        </Badge>
                    ) : lottery.status === 'completed' ? (
                        <Badge
                            variant="secondary"
                            className="font-semibold shadow-xs"
                        >
                            Completed
                        </Badge>
                    ) : lottery.status === 'cancelled' ? (
                        <Badge
                            variant="destructive"
                            className="font-semibold shadow-xs"
                        >
                            Cancelled
                        </Badge>
                    ) : (
                        <Badge className="bg-primary/90 text-primary-foreground font-semibold shadow-xs backdrop-blur-xs">
                            <Sparkles className="mr-1 size-3" />
                            Live Raffle
                        </Badge>
                    )}
                </div>

                {/* Multiple Image Carousel Controls */}
                {hasMultipleImages && (
                    <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                            type="button"
                            onClick={prevImage}
                            className="flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-xs transition hover:bg-black/70"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={nextImage}
                            className="flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-xs transition hover:bg-black/70"
                            aria-label="Next image"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                )}

                {/* Image Dots Indicator */}
                {hasMultipleImages && (
                    <div className="absolute inset-x-0 bottom-2.5 flex items-center justify-center gap-1.5">
                        {images.map((_, i) => (
                            <span
                                key={i}
                                className={cn(
                                    'size-1.5 rounded-full transition-all',
                                    i === activeImageIndex
                                        ? 'w-4 bg-white'
                                        : 'bg-white/50 hover:bg-white/80',
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Price Pill Floating */}
                <div className="bg-background/90 absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-xs">
                    <Tag className="text-primary size-3" />
                    <span className="text-foreground font-mono text-sm">
                        {lottery.ticket_price_formatted}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                        / ticket
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div className="space-y-2">
                    <Link
                        href={show.url({ lottery: lottery.id })}
                        className="hover:text-primary line-clamp-1 text-lg font-semibold tracking-tight transition-colors"
                    >
                        {lottery.title}
                    </Link>
                    <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                        {lottery.description}
                    </p>
                </div>

                {/* Progress & Stats */}
                <div className="space-y-2 border-t pt-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Ticket className="size-3.5" />
                            Progress
                        </span>
                        <span className="text-foreground font-mono font-semibold">
                            {lottery.tickets_sold} / {lottery.total_tickets}{' '}
                            <span className="text-muted-foreground font-normal">
                                ({lottery.progress_percentage}%)
                            </span>
                        </span>
                    </div>

                    <Progress
                        value={lottery.progress_percentage}
                        className="bg-muted h-2 rounded-full"
                    />

                    <div className="text-muted-foreground flex items-center justify-between pt-1 text-[11px]">
                        <span>{lottery.remaining_tickets} tickets left</span>
                        <span className="flex items-center gap-1">
                            <Users className="size-3" />
                            {lottery.participant_count} players
                        </span>
                    </div>
                </div>

                {/* CTA Button */}
                <Button
                    asChild
                    variant={isClosed ? 'outline' : 'default'}
                    className={cn(
                        'w-full font-medium',
                        !isClosed && 'shadow-xs',
                    )}
                >
                    <Link href={show.url({ lottery: lottery.id })}>
                        {lottery.is_sold_out
                            ? 'View Sold Out Raffle'
                            : isClosed
                              ? 'View Details'
                              : 'Buy Tickets'}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
