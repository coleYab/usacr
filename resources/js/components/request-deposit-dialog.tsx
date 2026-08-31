import { useForm } from '@inertiajs/react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';
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
import { cn } from '@/lib/utils';
import { store } from '@/routes/app/wallet/deposits';

const ACCEPTED = '.jpg,.jpeg,.png,.pdf';
const MAX_SIZE_MB = 5;

type RequestDepositDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RequestDepositDialog({
    open,
    onOpenChange,
}: RequestDepositDialogProps) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<{
        amount: string;
        receipt: File | null;
    }>({
        amount: '',
        receipt: null,
    });

    const reset = () => {
        form.reset();
        setDragActive(false);
    };

    const handleClose = (next: boolean) => {
        if (!form.processing) {
            onOpenChange(next);
            if (!next) {
                reset();
            }
        }
    };

    const setFile = (file: File | null) => {
        if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
            form.setError(
                'receipt',
                `Receipt must be ${MAX_SIZE_MB}MB or smaller.`,
            );
            return;
        }
        form.setData('receipt', file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setFile(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Request a Deposit</DialogTitle>
                        <DialogDescription>
                            Upload a proof-of-payment receipt. A member of our
                            team will review it and credit your wallet once
                            approved.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (USD)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="1"
                                placeholder="50.00"
                                value={form.data.amount}
                                onChange={(e) =>
                                    form.setData('amount', e.target.value)
                                }
                                disabled={form.processing}
                            />
                            {form.errors.amount && (
                                <p className="text-destructive text-sm">
                                    {form.errors.amount}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Receipt</Label>
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => fileInputRef.current?.click()}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        fileInputRef.current?.click();
                                    }
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragActive(true);
                                }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={onDrop}
                                className={cn(
                                    'hover:bg-muted/50 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                                    dragActive && 'border-primary bg-primary/5',
                                    form.data.receipt && 'border-primary',
                                )}
                            >
                                {form.data.receipt ? (
                                    <>
                                        <FileText className="text-primary size-8" />
                                        <p className="text-sm font-medium">
                                            {form.data.receipt.name}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            {(
                                                form.data.receipt.size / 1024
                                            ).toFixed(0)}{' '}
                                            KB
                                        </p>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="text-destructive inline-flex items-center gap-1 text-xs font-medium"
                                        >
                                            <X className="size-3.5" />
                                            Remove
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="text-muted-foreground size-8" />
                                        <p className="text-sm font-medium">
                                            Drag &amp; drop your receipt here,
                                            or{' '}
                                            <span className="text-primary">
                                                browse
                                            </span>
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            JPG, PNG or PDF up to {MAX_SIZE_MB}
                                            MB
                                        </p>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={ACCEPTED}
                                    className="sr-only"
                                    onChange={(e) =>
                                        setFile(e.target.files?.[0] ?? null)
                                    }
                                />
                            </div>
                            {form.errors.receipt && (
                                <p className="text-destructive text-sm">
                                    {form.errors.receipt}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleClose(false)}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                form.processing ||
                                !form.data.amount ||
                                !form.data.receipt
                            }
                        >
                            {form.processing ? 'Submitting…' : 'Submit Request'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
