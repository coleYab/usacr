import { useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Copy,
    FileText,
    Info,
    Smartphone,
    Sparkles,
    UploadCloud,
    Wallet,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
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

const TELEBIRR_DETAILS = {
    name: 'ቴሌብር (Telebirr)',
    phoneNumber: '0978665676',
    accountName: 'yirgalem',
    badge: 'ፈጣን ክፍያ',
};

type RequestDepositDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RequestDepositDialog({
    open,
    onOpenChange,
}: RequestDepositDialogProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [copiedField, setCopiedField] = useState<'phone' | 'name' | null>(
        null,
    );
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
        setStep(1);
        setCopiedField(null);
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

    const copyToClipboard = (text: string, field: 'phone' | 'name') => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            void navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    const setFile = (file: File | null) => {
        if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
            form.setError('receipt', `ደረሰኝ መጠን ከ ${MAX_SIZE_MB}MB ማነስ አለበት።`);
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

    const quickAmounts = ['50', '100', '250', '500', '1000'];

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                {/* Stepper Header */}
                <div className="mb-1 flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                'flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                                step === 1
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-primary/20 text-primary',
                            )}
                        >
                            {step > 1 ? <Check className="size-4" /> : '1'}
                        </div>
                        <span
                            className={cn(
                                'text-xs font-semibold',
                                step === 1
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            የቴሌብር መረጃ
                        </span>
                    </div>

                    <div className="bg-border h-px w-12 sm:w-20" />

                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                'flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                                step === 2
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground',
                            )}
                        >
                            2
                        </div>
                        <span
                            className={cn(
                                'text-xs font-semibold',
                                step === 2
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            መጠን እና ደረሰኝ
                        </span>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                የተቀማጭ ገንዘብ ክፍያ መረጃ
                            </DialogTitle>
                            <DialogDescription>
                                በቴሌብር (Telebirr) በኩል ክፍያ ለመፈጸም ከታች የተሰጠውን የሂሳብ
                                መረጃ ይጠቀሙ።
                            </DialogDescription>
                        </DialogHeader>

                        {/* Telebirr Method Card & Details */}
                        <div className="border-primary/30 bg-primary/5 space-y-4 rounded-xl border p-4">
                            <div className="border-primary/10 flex items-center justify-between border-b pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg shadow-xs">
                                        <Smartphone className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">
                                            {TELEBIRR_DETAILS.name}
                                        </h4>
                                        <p className="text-muted-foreground text-xs">
                                            በቴሌብር ስልክ ቁጥር በቀጥታ ይላኩ
                                        </p>
                                    </div>
                                </div>
                                <Badge className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400">
                                    <Sparkles className="mr-1 size-2.5" />
                                    {TELEBIRR_DETAILS.badge}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* Phone Number */}
                                <div className="bg-background/90 flex items-center justify-between rounded-lg border p-3 shadow-2xs">
                                    <div className="space-y-0.5">
                                        <p className="text-muted-foreground text-[11px] font-medium">
                                            የቴሌብር ስልክ ቁጥር
                                        </p>
                                        <p className="font-mono text-base font-bold tracking-wider">
                                            {TELEBIRR_DETAILS.phoneNumber}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="h-8 gap-1 text-xs"
                                        onClick={() =>
                                            copyToClipboard(
                                                TELEBIRR_DETAILS.phoneNumber,
                                                'phone',
                                            )
                                        }
                                    >
                                        {copiedField === 'phone' ? (
                                            <>
                                                <Check className="size-3.5 text-emerald-500" />
                                                ተቀድቷል!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="size-3.5" />
                                                ቅዳ
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Account Holder Name */}
                                <div className="bg-background/90 flex items-center justify-between rounded-lg border p-3 shadow-2xs">
                                    <div className="space-y-0.5">
                                        <p className="text-muted-foreground text-[11px] font-medium">
                                            የመለያው ባለቤት ስም
                                        </p>
                                        <p className="font-mono text-base font-bold">
                                            {TELEBIRR_DETAILS.accountName}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="h-8 gap-1 text-xs"
                                        onClick={() =>
                                            copyToClipboard(
                                                TELEBIRR_DETAILS.accountName,
                                                'name',
                                            )
                                        }
                                    >
                                        {copiedField === 'name' ? (
                                            <>
                                                <Check className="size-3.5 text-emerald-500" />
                                                ተቀድቷል!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="size-3.5" />
                                                ቅዳ
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Instructions Box */}
                            <div className="bg-background/60 border-primary/10 text-muted-foreground space-y-2 rounded-lg border p-3 text-xs">
                                <div className="text-foreground flex items-center gap-1.5 font-semibold">
                                    <Info className="text-primary size-4 shrink-0" />
                                    <span>የክፍያ ቅደም ተከተል፦</span>
                                </div>
                                <ol className="list-decimal space-y-1 pl-5">
                                    <li>የቴሌብር መተግበሪያዎን ወይም *127# ይክፈቱ።</li>
                                    <li>
                                        ወደ ስልክ ቁጥር{' '}
                                        <strong className="text-foreground font-mono">
                                            {TELEBIRR_DETAILS.phoneNumber}
                                        </strong>{' '}
                                        (ስም፦{' '}
                                        <strong className="text-foreground font-mono">
                                            {TELEBIRR_DETAILS.accountName}
                                        </strong>
                                        ) ማስገባት የሚፈልጉትን የገንዘብ መጠን ይላኩ።
                                    </li>
                                    <li>
                                        ክፍያው ሲጠናቀቅ የክፍያውን ማረጋገጫ ደረሰኝ (ስክሪንሾት)
                                        ያስቀምጡ።
                                    </li>
                                </ol>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:justify-between">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleClose(false)}
                            >
                                ይቅር
                            </Button>
                            <Button
                                type="button"
                                className="gap-1.5"
                                onClick={() => setStep(2)}
                            >
                                ወደ ደረሰኝ ማስገቢያ ቀጥል
                                <ArrowRight className="size-4" />
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={submit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                ያስገቡት የገንዘብ መጠን እና ደረሰኝ
                            </DialogTitle>
                            <DialogDescription>
                                በቴሌብር ያስተላለፉትን ትክክለኛ የገንዘብ መጠን ይጻፉ እና የክፍያውን
                                ደረሰኝ (ስክሪንሾት) እዚህ ይስቀሉ።
                            </DialogDescription>
                        </DialogHeader>

                        {/* Selected Method Summary Banner */}
                        <div className="bg-muted/60 flex items-center justify-between rounded-xl border p-3">
                            <div className="flex items-center gap-2.5">
                                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                                    <Smartphone className="size-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-semibold">
                                        {TELEBIRR_DETAILS.name}
                                    </p>
                                    <p className="text-muted-foreground font-mono text-xs">
                                        {TELEBIRR_DETAILS.phoneNumber} (
                                        {TELEBIRR_DETAILS.accountName})
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary h-7 text-xs"
                                onClick={() => setStep(1)}
                            >
                                መረጃ ይመልከቱ
                            </Button>
                        </div>

                        {/* Amount Input with Quick Select */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="amount"
                                    className="text-sm font-semibold"
                                >
                                    ያስገቡት የገንዘብ መጠን (USD)
                                </Label>
                                <span className="text-muted-foreground text-xs">
                                    ዝቅተኛ መጠን፦ $1.00
                                </span>
                            </div>

                            <div className="relative">
                                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm font-bold">
                                    $
                                </span>
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
                                    className="pl-7 font-mono font-bold"
                                    autoFocus
                                />
                            </div>

                            {/* Quick Presets */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-muted-foreground mr-1 text-xs">
                                    ፈጣን ምርጫ፦
                                </span>
                                {quickAmounts.map((q) => (
                                    <Button
                                        key={q}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                            'h-7 px-2 font-mono text-xs',
                                            form.data.amount === q &&
                                                'border-primary bg-primary/10 text-primary font-bold',
                                        )}
                                        onClick={() =>
                                            form.setData('amount', q)
                                        }
                                    >
                                        ${q}
                                    </Button>
                                ))}
                            </div>

                            {form.errors.amount && (
                                <p className="text-destructive text-sm font-medium">
                                    {form.errors.amount}
                                </p>
                            )}
                        </div>

                        {/* Receipt Upload Dropzone */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">
                                የክፍያ ማረጋገጫ ደረሰኝ (ስክሪንሾት / ፒዲኤፍ)
                            </Label>
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
                                    'hover:bg-muted/50 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors',
                                    dragActive && 'border-primary bg-primary/5',
                                    form.data.receipt
                                        ? 'border-primary/50 bg-primary/5'
                                        : 'border-border',
                                )}
                            >
                                {form.data.receipt ? (
                                    <>
                                        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                                            <FileText className="size-6" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-foreground text-sm font-bold">
                                                {form.data.receipt.name}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {(
                                                    form.data.receipt.size /
                                                    1024
                                                ).toFixed(0)}{' '}
                                                KB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="text-destructive hover:bg-destructive/10 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors"
                                        >
                                            <X className="size-3.5" />
                                            ደረሰኙን አስወግድ
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-xl">
                                            <UploadCloud className="size-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                የደረሰኝ ስክሪንሾት እዚህ ይጎትቱ እና ይልቀቁ፣
                                                ወይም{' '}
                                                <span className="text-primary font-bold underline underline-offset-2">
                                                    ይምረጡ
                                                </span>
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                JPG, PNG ወይም PDF እስከ{' '}
                                                {MAX_SIZE_MB}
                                                MB
                                            </p>
                                        </div>
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
                                <p className="text-destructive text-sm font-medium">
                                    {form.errors.receipt}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="gap-2 pt-2 sm:justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => setStep(1)}
                                disabled={form.processing}
                            >
                                <ArrowLeft className="size-4" />
                                ወደ ኋላ
                            </Button>
                            <Button
                                type="submit"
                                className="gap-1.5"
                                disabled={
                                    form.processing ||
                                    !form.data.amount ||
                                    !form.data.receipt
                                }
                            >
                                <Wallet className="size-4" />
                                {form.processing
                                    ? 'በመላክ ላይ…'
                                    : 'የተቀማጭ ጥያቄውን ላክ'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
