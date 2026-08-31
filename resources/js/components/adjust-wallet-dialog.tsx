import { useForm } from '@inertiajs/react';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { adjustWallet as adjustWalletRoute } from '@/routes/admin/users';

type AdjustWalletDialogProps = {
    user: {
        id: number;
        name: string;
        email: string;
        balance_formatted: string;
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function AdjustWalletDialog({
    user,
    open,
    onOpenChange,
}: AdjustWalletDialogProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            direction: 'credit' as 'credit' | 'debit',
            amount: '',
            reason: '',
        });

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
        onOpenChange(isOpen);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            return;
        }

        post(adjustWalletRoute.url({ user: user.id }), {
            preserveScroll: true,
            onSuccess: () => {
                handleOpenChange(false);
            },
        });
    };

    if (!user) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <Wallet className="text-primary size-5 shrink-0" />
                            <DialogTitle>Manual Wallet Adjustment</DialogTitle>
                        </div>
                        <DialogDescription>
                            Adjust ledger balance for{' '}
                            <span className="text-foreground font-medium">
                                {user.name}
                            </span>{' '}
                            ({user.email}). Current balance:{' '}
                            <span className="text-foreground font-semibold">
                                {user.balance_formatted}
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>

                    {/* Direction Switch */}
                    <div className="space-y-1.5">
                        <Label>Adjustment Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant={
                                    data.direction === 'credit'
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => setData('direction', 'credit')}
                                className={
                                    data.direction === 'credit'
                                        ? 'gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'gap-1.5'
                                }
                            >
                                <ArrowDownLeft className="size-4" />
                                Credit (Deposit / Reward)
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    data.direction === 'debit'
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => setData('direction', 'debit')}
                                className={
                                    data.direction === 'debit'
                                        ? 'bg-destructive hover:bg-destructive/90 gap-1.5 text-white'
                                        : 'gap-1.5'
                                }
                            >
                                <ArrowUpRight className="size-4" />
                                Debit (Deduction)
                            </Button>
                        </div>
                        {errors.direction && (
                            <p className="text-destructive text-xs">
                                {errors.direction}
                            </p>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                        <Label htmlFor="adjust-amount">
                            Amount (USD){' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <DollarSign className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 size-4" />
                            <Input
                                id="adjust-amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                className="pl-9 font-mono"
                                value={data.amount}
                                onChange={(e) =>
                                    setData('amount', e.target.value)
                                }
                                required
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-destructive text-xs">
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5">
                        <Label htmlFor="adjust-reason">
                            Audit Justification Reason{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="adjust-reason"
                            placeholder="State the administrative rationale (e.g., Promotional goodwill bonus, dispute resolution, fraud correction)..."
                            rows={3}
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            required
                        />
                        {errors.reason && (
                            <p className="text-destructive text-xs">
                                {errors.reason}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                !data.amount ||
                                data.reason.trim().length < 3
                            }
                            className={
                                data.direction === 'credit'
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-destructive hover:bg-destructive/90 text-white'
                            }
                        >
                            {processing
                                ? 'Processing...'
                                : `Confirm ${data.direction === 'credit' ? 'Credit' : 'Debit'}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
