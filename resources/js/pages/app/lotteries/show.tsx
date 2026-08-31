import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock,
    Minus,
    Plus,
    Sparkles,
    Ticket as TicketIcon,
    Trophy,
    Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { CountdownBadge } from '@/components/countdown-badge';
import { LotteryStatusBadge } from '@/components/lottery-status-badge';
import { formatMoney } from '@/lib/format-money';
import {
    lotteries,
    tickets as ticketsRoute,
    wallet as walletRoute,
} from '@/routes/app';
import { purchase } from '@/routes/app/lotteries';
import { cn } from '@/lib/utils';
import type { LotteryRow, TicketRow } from '@/types';

type Props = {
    lottery: LotteryRow;
    userTickets: TicketRow[];
    walletBalance: string;
};

export default function AppLotteryShow({
    lottery,
    userTickets,
    walletBalance,
}: Props) {
    const page = usePage();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [confirming, setConfirming] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);

    // Get purchased tickets returned from flash data, if any
    const purchasedTicketCodes =
        (page.props.purchased_tickets as string[] | undefined) || [];
    const [showSuccessModal, setShowSuccessModal] = useState(
        Boolean(purchasedTicketCodes.length),
    );

    const images =
        lottery.media && lottery.media.length > 0
            ? lottery.media
            : [
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
              ];

    const numericWalletBalance = useMemo(() => {
        return parseFloat(walletBalance.replace(/[^0-9.]/g, '')) || 0;
    }, [walletBalance]);

    const unitPrice = parseFloat(lottery.ticket_price) || 0;
    const totalCost = quantity * unitPrice;
    const hasEnoughBalance = numericWalletBalance >= totalCost;
    const maxAffordable =
        unitPrice > 0 ? Math.floor(numericWalletBalance / unitPrice) : 0;
    const maxAllowed = Math.min(lottery.remaining_tickets, 100);
    const isAvailable = lottery.is_open && lottery.status === 'active';
    const isCompleted = lottery.status === 'completed';

    const winningUserTicket = useMemo(() => {
        return userTickets.find(
            (t) =>
                t.is_won ||
                (lottery.winning_ticket_code &&
                    t.ticket_code === lottery.winning_ticket_code),
        );
    }, [userTickets, lottery.winning_ticket_code]);

    const isUserWinner = Boolean(winningUserTicket);

    const handleQuantityChange = (val: number) => {
        if (isNaN(val)) {
            setQuantity(1);
            return;
        }
        const clamped = Math.max(1, Math.min(val, maxAllowed));
        setQuantity(clamped);
    };

    const handleConfirmPurchase = () => {
        setIsPurchasing(true);
        router.post(
            purchase.url({ lottery: lottery.id }),
            { quantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirming(false);
                    setIsPurchasing(false);
                    setShowSuccessModal(true);
                },
                onError: () => {
                    setIsPurchasing(false);
                },
            },
        );
    };

    return (
        <>
            <Head title={lottery.title} />
            <div className="flex flex-col gap-8 pb-12">
                {/* Back Link & Header */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="-ml-3 gap-1"
                    >
                        <Link href={lotteries()}>
                            <ArrowRight className="size-4 rotate-180" />
                            Back to Lotteries
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <LotteryStatusBadge
                            status={lottery.status}
                            label={lottery.status_label}
                        />
                        <CountdownBadge
                            targetDate={lottery.draw_at}
                            isClosed={!isAvailable}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left Column: Gallery & Description */}
                    <div className="space-y-6 lg:col-span-7">
                        {/* Main Image Gallery Preview */}
                        <div className="bg-muted overflow-hidden rounded-2xl border shadow-xs">
                            <div className="bg-muted relative aspect-16/10 w-full overflow-hidden">
                                <img
                                    src={images[selectedImage]}
                                    alt={lottery.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Thumbnail Selector */}
                            {images.length > 1 && (
                                <div className="bg-card flex gap-2 overflow-x-auto border-t p-3">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() =>
                                                setSelectedImage(idx)
                                            }
                                            className={cn(
                                                'relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                                                selectedImage === idx
                                                    ? 'border-primary ring-primary/20 ring-2'
                                                    : 'border-transparent opacity-60 hover:opacity-100',
                                            )}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description & Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">
                                    Raffle Details &amp; Specifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                                    {lottery.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm sm:grid-cols-3">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Draw Date
                                        </p>
                                        <p className="text-foreground font-medium">
                                            {lottery.draw_at_formatted}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Total Capacity
                                        </p>
                                        <p className="text-foreground font-medium">
                                            {lottery.total_tickets} tickets
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Participants
                                        </p>
                                        <p className="text-foreground font-medium">
                                            {lottery.participant_count} players
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Owned Tickets by User for this Raffle */}
                        {userTickets.length > 0 && (
                            <Card className="border-primary/30 bg-primary/5">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                            <TicketIcon className="text-primary size-4" />
                                            Your Tickets in this Raffle (
                                            {userTickets.length})
                                        </CardTitle>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={ticketsRoute()}>
                                                View All Tickets
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {userTickets.map((t) => (
                                            <Badge
                                                key={t.id}
                                                variant="secondary"
                                                className="bg-background border px-2.5 py-1 font-mono text-xs shadow-xs"
                                            >
                                                {t.ticket_code}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Ticket Purchase Panel */}
                    <div className="space-y-6 lg:col-span-5">
                        <Card className="border-border sticky top-6 shadow-sm">
                            <CardHeader className="space-y-3 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className="text-xs font-semibold"
                                    >
                                        <Sparkles className="text-primary mr-1 size-3" />
                                        Official Raffle
                                    </Badge>
                                    <span className="text-muted-foreground text-xs">
                                        {lottery.remaining_tickets} remaining
                                    </span>
                                </div>

                                <h1 className="text-foreground text-2xl font-bold tracking-tight">
                                    {lottery.title}
                                </h1>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-foreground font-mono text-3xl font-bold tracking-tight">
                                        {lottery.ticket_price_formatted}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        / ticket
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-5">
                                {/* Sales Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-muted-foreground">
                                            Tickets Sold
                                        </span>
                                        <span className="font-mono font-semibold">
                                            {lottery.tickets_sold} /{' '}
                                            {lottery.total_tickets} (
                                            {lottery.progress_percentage}%)
                                        </span>
                                    </div>
                                    <Progress
                                        value={lottery.progress_percentage}
                                        className="h-2.5 rounded-full"
                                    />
                                </div>

                                {/* Purchase Form or Closed Notice */}
                                {isAvailable ? (
                                    <div className="space-y-5">
                                        {/* Stepper */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label
                                                    htmlFor="qty"
                                                    className="text-sm font-medium"
                                                >
                                                    Select Quantity
                                                </label>
                                                <span className="text-muted-foreground text-xs">
                                                    Max {maxAllowed} per order
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="size-10 shrink-0"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            quantity - 1,
                                                        )
                                                    }
                                                    disabled={quantity <= 1}
                                                >
                                                    <Minus className="size-4" />
                                                </Button>

                                                <Input
                                                    id="qty"
                                                    type="number"
                                                    min={1}
                                                    max={maxAllowed}
                                                    value={quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="h-10 text-center font-mono text-lg font-semibold"
                                                />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="size-10 shrink-0"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            quantity + 1,
                                                        )
                                                    }
                                                    disabled={
                                                        quantity >= maxAllowed
                                                    }
                                                >
                                                    <Plus className="size-4" />
                                                </Button>
                                            </div>

                                            {/* Quick Preset Buttons */}
                                            <div className="flex items-center gap-2 pt-1">
                                                {[1, 5, 10, 20].map(
                                                    (preset) =>
                                                        preset <=
                                                            maxAllowed && (
                                                            <Button
                                                                key={preset}
                                                                type="button"
                                                                variant={
                                                                    quantity ===
                                                                    preset
                                                                        ? 'secondary'
                                                                        : 'outline'
                                                                }
                                                                size="sm"
                                                                className="flex-1 font-mono text-xs"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        preset,
                                                                    )
                                                                }
                                                            >
                                                                {preset}
                                                            </Button>
                                                        ),
                                                )}
                                                {maxAllowed > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-xs font-medium"
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                Math.min(
                                                                    maxAllowed,
                                                                    maxAffordable ||
                                                                        maxAllowed,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        Max
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cost Breakdown */}
                                        <div className="bg-muted/40 space-y-2 rounded-xl border p-4 text-sm">
                                            <div className="text-muted-foreground flex justify-between">
                                                <span>Price per ticket</span>
                                                <span className="font-mono">
                                                    {
                                                        lottery.ticket_price_formatted
                                                    }
                                                </span>
                                            </div>
                                            <div className="text-muted-foreground flex justify-between">
                                                <span>Quantity</span>
                                                <span className="font-mono">
                                                    × {quantity}
                                                </span>
                                            </div>
                                            <div className="text-foreground flex justify-between border-t pt-2 text-base font-semibold">
                                                <span>Total Cost</span>
                                                <span className="text-primary font-mono">
                                                    {formatMoney(totalCost)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Wallet Status & Action */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between px-1 text-xs">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Wallet className="size-3.5" />
                                                    Your Balance
                                                </span>
                                                <span
                                                    className={cn(
                                                        'font-mono font-semibold',
                                                        hasEnoughBalance
                                                            ? 'text-foreground'
                                                            : 'text-destructive',
                                                    )}
                                                >
                                                    {walletBalance}
                                                </span>
                                            </div>

                                            {!hasEnoughBalance && (
                                                <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-xs">
                                                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                                    <div className="space-y-1">
                                                        <p className="font-medium">
                                                            Insufficient balance
                                                        </p>
                                                        <p>
                                                            You need an
                                                            additional{' '}
                                                            {formatMoney(
                                                                totalCost -
                                                                    numericWalletBalance,
                                                            )}{' '}
                                                            to complete this
                                                            purchase.{' '}
                                                            <Link
                                                                href={walletRoute()}
                                                                className="font-semibold underline underline-offset-2"
                                                            >
                                                                Deposit funds
                                                                now &rarr;
                                                            </Link>
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <Button
                                                type="button"
                                                className="h-11 w-full text-base font-semibold shadow-sm"
                                                disabled={
                                                    !hasEnoughBalance ||
                                                    quantity <= 0 ||
                                                    isPurchasing
                                                }
                                                onClick={() =>
                                                    setConfirming(true)
                                                }
                                            >
                                                {isPurchasing
                                                    ? 'Processing Order…'
                                                    : `Buy ${quantity} Ticket${quantity > 1 ? 's' : ''} — ${formatMoney(totalCost)}`}
                                            </Button>
                                        </div>
                                    </div>
                                ) : isCompleted ? (
                                    <div className="space-y-4">
                                        {isUserWinner ? (
                                            <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent p-6 text-center shadow-lg shadow-amber-500/10">
                                                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 ring-8 ring-amber-500/10">
                                                    <Trophy className="size-8 text-amber-400" />
                                                </div>
                                                <div className="mt-4 space-y-1">
                                                    <Badge className="bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-black hover:bg-amber-500">
                                                        OFFICIAL WINNER
                                                    </Badge>
                                                    <h3 className="text-foreground pt-2 text-xl font-extrabold tracking-tight">
                                                        You Won This Raffle! 🎉
                                                    </h3>
                                                    <p className="text-muted-foreground mx-auto max-w-xs text-xs leading-relaxed">
                                                        Your ticket was randomly
                                                        selected as the winning
                                                        entry in this draw.
                                                    </p>
                                                </div>

                                                <div className="bg-background/80 mt-4 rounded-xl border border-amber-500/30 p-3.5 backdrop-blur-xs">
                                                    <span className="text-muted-foreground block text-[11px] font-medium">
                                                        Winning Ticket Code
                                                    </span>
                                                    <span className="font-mono text-lg font-bold tracking-wider text-amber-500">
                                                        {
                                                            lottery.winning_ticket_code
                                                        }
                                                    </span>
                                                </div>

                                                <Button
                                                    asChild
                                                    className="mt-4 w-full bg-amber-500 font-bold text-black hover:bg-amber-400"
                                                >
                                                    <Link href={ticketsRoute()}>
                                                        View in My Tickets
                                                    </Link>
                                                </Button>
                                            </div>
                                        ) : userTickets.length > 0 ? (
                                            <div className="bg-muted/40 space-y-4 rounded-xl border p-5 text-center">
                                                <div className="bg-muted text-muted-foreground mx-auto flex size-10 items-center justify-center rounded-full">
                                                    <TicketIcon className="size-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold">
                                                        Draw Completed
                                                    </h4>
                                                    <p className="text-muted-foreground text-xs">
                                                        The drawing for this
                                                        raffle has concluded.
                                                        Your tickets were
                                                        entered, but another
                                                        ticket was selected as
                                                        the winner.
                                                    </p>
                                                </div>

                                                <div className="bg-background space-y-1 rounded-lg border p-3 text-left text-xs">
                                                    <div className="text-muted-foreground flex justify-between">
                                                        <span>
                                                            Winning Ticket:
                                                        </span>
                                                        <span className="text-foreground font-mono font-semibold">
                                                            {
                                                                lottery.winning_ticket_code
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="text-muted-foreground flex justify-between">
                                                        <span>Winner:</span>
                                                        <span className="text-foreground font-medium">
                                                            {lottery.winner_name ??
                                                                'Player'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="w-full"
                                                >
                                                    <Link href={lotteries()}>
                                                        Browse Live Raffles
                                                    </Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="bg-muted/30 space-y-4 rounded-xl border p-5 text-center">
                                                <div className="bg-muted text-muted-foreground mx-auto flex size-10 items-center justify-center rounded-full">
                                                    <CheckCircle2 className="size-5 text-emerald-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold">
                                                        Raffle Concluded
                                                    </h4>
                                                    <p className="text-muted-foreground text-xs">
                                                        This raffle was drawn on{' '}
                                                        {
                                                            lottery.draw_at_formatted
                                                        }
                                                        .
                                                    </p>
                                                </div>

                                                <div className="bg-background space-y-1.5 rounded-lg border p-3 text-left text-xs">
                                                    <div className="text-muted-foreground flex justify-between">
                                                        <span>
                                                            Winning Ticket:
                                                        </span>
                                                        <span className="font-mono font-bold text-amber-500">
                                                            {
                                                                lottery.winning_ticket_code
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="text-muted-foreground flex justify-between">
                                                        <span>
                                                            Total Participants:
                                                        </span>
                                                        <span className="text-foreground font-medium">
                                                            {
                                                                lottery.participant_count
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="w-full"
                                                >
                                                    <Link href={lotteries()}>
                                                        Browse Other Raffles
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-muted/50 space-y-3 rounded-xl border p-6 text-center">
                                        <Clock className="text-muted-foreground mx-auto size-8" />
                                        <div className="space-y-1">
                                            <p className="text-foreground font-semibold">
                                                {lottery.is_sold_out
                                                    ? 'This Raffle is Sold Out'
                                                    : 'Raffle Closed'}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {lottery.is_sold_out
                                                    ? 'All available tickets have been purchased. Stay tuned for the drawing!'
                                                    : 'Ticket sales for this lottery have concluded.'}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={lotteries()}>
                                                Browse Other Lotteries
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog open={confirming} onOpenChange={setConfirming}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Confirm Ticket Purchase
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2 pt-2">
                            <span>You are about to purchase </span>
                            <strong className="text-foreground">
                                {quantity} ticket(s)
                            </strong>
                            <span> for </span>
                            <strong className="text-foreground">
                                "{lottery.title}"
                            </strong>
                            <span> for a total of </span>
                            <strong className="text-primary font-mono">
                                {formatMoney(totalCost)}
                            </strong>
                            .
                            <p className="text-muted-foreground pt-2 text-xs">
                                This will debit your wallet balance immediately
                                and cannot be refunded unless the raffle is
                                cancelled.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPurchasing}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmPurchase}
                            disabled={isPurchasing}
                            className="bg-primary text-primary-foreground"
                        >
                            {isPurchasing ? 'Purchasing…' : 'Confirm & Buy'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Success Tickets Reveal Modal */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="bg-primary/10 text-primary mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <DialogTitle className="text-center text-xl font-bold">
                            Tickets Purchased!
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            You're in! Here are your ticket numbers for{' '}
                            <strong className="text-foreground">
                                {lottery.title}
                            </strong>
                            :
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-muted/40 max-h-48 space-y-2 overflow-y-auto rounded-lg border p-4">
                        {purchasedTicketCodes.length > 0 ? (
                            purchasedTicketCodes.map((code, idx) => (
                                <div
                                    key={idx}
                                    className="bg-background flex items-center justify-between rounded-md border px-3 py-2 font-mono text-sm shadow-2xs"
                                >
                                    <span className="text-muted-foreground text-xs">
                                        Ticket #{idx + 1}
                                    </span>
                                    <span className="text-primary font-semibold">
                                        {code}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground py-2 text-center text-sm">
                                Check "My Tickets" to view your newly issued
                                codes.
                            </p>
                        )}
                    </div>

                    <DialogFooter className="flex-col gap-2 pt-2 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Close
                        </Button>
                        <Button asChild className="w-full sm:w-auto">
                            <Link href={ticketsRoute()}>View My Tickets</Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AppLotteryShow.layout = {
    breadcrumbs: [
        {
            title: 'Lotteries',
            href: lotteries(),
        },
        {
            title: 'Details',
            href: '#',
        },
    ],
};
