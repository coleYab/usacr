import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cancel } from '@/routes/admin/lotteries';
import type { LotteryRow } from '@/types';

type CancelLotteryDialogProps = {
    lottery: LotteryRow | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CancelLotteryDialog({
    lottery,
    open,
    onOpenChange,
}: CancelLotteryDialogProps) {
    const form = useForm<{ reason: string }>({
        reason: '',
    });

    if (!lottery) {
        return null;
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(cancel.url({ lottery: lottery.id }), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <div className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="size-5" />
                            <DialogTitle>
                                Cancel Lottery &amp; Refund
                            </DialogTitle>
                        </div>
                        <DialogDescription>
                            Cancelling{' '}
                            <span className="text-foreground font-semibold">
                                "{lottery.title}"
                            </span>{' '}
                            will automatically refund all {lottery.tickets_sold}{' '}
                            ticket purchases back to their owners' wallets. This
                            action is irreversible.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-4">
                        <Label htmlFor="cancel-reason">
                            Cancellation Reason{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="cancel-reason"
                            value={form.data.reason}
                            onChange={(e) =>
                                form.setData('reason', e.target.value)
                            }
                            placeholder="e.g. Item damaged before draw or unexpected supply issue."
                            rows={3}
                            disabled={form.processing}
                        />
                        {form.errors.reason && (
                            <p className="text-destructive text-sm">
                                {form.errors.reason}
                            </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                            Must be at least 10 characters.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={form.processing}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={
                                form.processing || form.data.reason.length < 10
                            }
                        >
                            {form.processing
                                ? 'Cancelling & Refunding…'
                                : 'Confirm Cancellation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
