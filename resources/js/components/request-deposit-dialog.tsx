import { useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Building2,
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

type PaymentMethod = {
    id: string;
    name: string;
    type: 'telebirr' | 'cbe' | 'cbe_birr' | 'boa';
    accountNumber: string;
    accountName: string;
    description: string;
    badge?: string;
    isRecommended?: boolean;
    icon: typeof Smartphone;
};

const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'telebirr',
        name: 'ቴሌብር (Telebirr)',
        type: 'telebirr',
        accountNumber: '0978665676',
        accountName: 'yirgalem',
        description: 'በቴሌብር ስልክ ቁጥር በቀጥታ ገንዘቡን ይላኩ',
        badge: 'ፈጣን ክፍያ',
        isRecommended: true,
        icon: Smartphone,
    },
    {
        id: 'cbe',
        name: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
        type: 'cbe',
        accountNumber: '1000458923412',
        accountName: 'yirgalem',
        description: 'በ CBE ሞባይል ባንኪንግ ወይም በቅርንጫፍ በቀጥታ ያስተላልፉ',
        badge: 'ባንክ',
        icon: Building2,
    },
    {
        id: 'cbe_birr',
        name: 'ሲቢኢ ብር (CBEBirr)',
        type: 'cbe_birr',
        accountNumber: '0978665676',
        accountName: 'yirgalem',
        description: 'በሲቢኢ ብር መተግበሪያ ወይም በ *847# ይላኩ',
        badge: 'ፈጣን ክፍያ',
        icon: Smartphone,
    },
    {
        id: 'boa',
        name: 'አቢሲኒያ ባንክ (Bank of Abyssinia)',
        type: 'boa',
        accountNumber: '89234156',
        accountName: 'yirgalem',
        description: 'በ BoA ሞባይል ባንኪንግ በቀጥታ ያስተላልፉ',
        badge: 'ባንክ',
        icon: Building2,
    },
];

type RequestDepositDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RequestDepositDialog({
    open,
    onOpenChange,
}: RequestDepositDialogProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedMethodId, setSelectedMethodId] =
        useState<string>('telebirr');
    const [copiedField, setCopiedField] = useState<'account' | 'name' | null>(
        null,
    );
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedMethod =
        PAYMENT_METHODS.find((m) => m.id === selectedMethodId) ??
        PAYMENT_METHODS[0];

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
        setSelectedMethodId('telebirr');
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

    const copyToClipboard = (text: string, field: 'account' | 'name') => {
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
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
                            የክፍያ ዘዴ
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
                            የገንዘብ መጠን እና ደረሰኝ
                        </span>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                የክፍያ ዘዴ ይምረጡ
                            </DialogTitle>
                            <DialogDescription>
                                ክፍያ የሚፈጽሙበትን የክፍያ መንገድ ይምረጡ፤ ከዚያም የተሰጠውን የሂሳብ
                                መረጃ በመጠቀም ክፍያዎን ያጠናቅቁ።
                            </DialogDescription>
                        </DialogHeader>

                        {/* List of Payment Methods */}
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {PAYMENT_METHODS.map((method) => {
                                const IconComponent = method.icon;
                                const isSelected =
                                    selectedMethodId === method.id;

                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedMethodId(method.id)
                                        }
                                        className={cn(
                                            'relative flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all',
                                            isSelected
                                                ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-2'
                                                : 'border-border bg-card hover:border-foreground/30 hover:bg-muted/30',
                                        )}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className={cn(
                                                        'flex size-8 items-center justify-center rounded-lg',
                                                        isSelected
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted text-foreground',
                                                    )}
                                                >
                                                    <IconComponent className="size-4" />
                                                </div>
                                                <span className="text-sm font-semibold">
                                                    {method.name}
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <div className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full">
                                                    <Check className="size-3 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-muted-foreground text-xs leading-relaxed">
                                            {method.description}
                                        </p>

                                        {method.badge && (
                                            <div className="mt-0.5 flex items-center gap-1">
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        'h-4.5 px-1.5 py-0 text-[10px]',
                                                        method.isRecommended &&
                                                            'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                                                    )}
                                                >
                                                    {method.isRecommended && (
                                                        <Sparkles className="mr-1 size-2.5" />
                                                    )}
                                                    {method.badge}
                                                </Badge>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Payment Details Box */}
                        <div className="border-primary/20 bg-primary/5 space-y-3 rounded-xl border p-4">
                            <div className="border-primary/10 flex items-center justify-between border-b pb-2.5">
                                <div className="flex items-center gap-2">
                                    <selectedMethod.icon className="text-primary size-5" />
                                    <h4 className="text-sm font-bold">
                                        የ {selectedMethod.name} የክፍያ መረጃ
                                    </h4>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="border-primary/30 text-primary text-xs"
                                >
                                    የተመረጠ
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* Account / Phone Number */}
                                <div className="bg-background/80 flex items-center justify-between rounded-lg border p-2.5">
                                    <div className="space-y-0.5">
                                        <p className="text-muted-foreground text-[11px]">
                                            {selectedMethod.type ===
                                                'telebirr' ||
                                            selectedMethod.type === 'cbe_birr'
                                                ? 'የስልክ ቁጥር'
                                                : 'የሂሳብ ቁጥር'}
                                        </p>
                                        <p className="font-mono text-base font-bold tracking-wider">
                                            {selectedMethod.accountNumber}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="h-8 gap-1 text-xs"
                                        onClick={() =>
                                            copyToClipboard(
                                                selectedMethod.accountNumber,
                                                'account',
                                            )
                                        }
                                    >
                                        {copiedField === 'account' ? (
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
                                <div className="bg-background/80 flex items-center justify-between rounded-lg border p-2.5">
                                    <div className="space-y-0.5">
                                        <p className="text-muted-foreground text-[11px]">
                                            የመለያው ባለቤት ስም
                                        </p>
                                        <p className="font-mono text-base font-bold">
                                            {selectedMethod.accountName}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="h-8 gap-1 text-xs"
                                        onClick={() =>
                                            copyToClipboard(
                                                selectedMethod.accountName,
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

                            <div className="text-muted-foreground flex items-start gap-2 pt-1 text-xs">
                                <Info className="text-primary mt-0.5 size-4 shrink-0" />
                                <p>
                                    ገንዘቡን ወደተጠቀሰው መረጃ ከላኩ በኋላ{' '}
                                    <strong className="text-foreground">
                                        የክፍያውን ማረጋገጫ ደረሰኝ (ስክሪንሾት)
                                    </strong>{' '}
                                    በማስቀመጥ "ቀጥል" የሚለውን ይጫኑ።
                                </p>
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
                                ያስተላለፉትን ትክክለኛ የገንዘብ መጠን ይጻፉ እና የክፍያውን ደረሰኝ
                                (ስክሪንሾት) እዚህ ይስቀሉ።
                            </DialogDescription>
                        </DialogHeader>

                        {/* Selected Method Summary Banner */}
                        <div className="bg-muted/60 flex items-center justify-between rounded-xl border p-3">
                            <div className="flex items-center gap-2.5">
                                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                                    <selectedMethod.icon className="size-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-semibold">
                                        {selectedMethod.name}
                                    </p>
                                    <p className="text-muted-foreground font-mono text-xs">
                                        {selectedMethod.accountNumber} (
                                        {selectedMethod.accountName})
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
                                ዘዴ ቀይር
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
