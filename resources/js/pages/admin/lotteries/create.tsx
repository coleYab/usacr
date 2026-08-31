import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { dashboard, lotteries } from '@/routes/admin';
import { store } from '@/routes/admin/lotteries';
import { cn } from '@/lib/utils';

export default function AdminLotteriesCreate() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);

    const form = useForm<{
        title: string;
        description: string;
        ticket_price: string;
        total_tickets: string;
        draw_at: string;
        status: 'draft' | 'active';
        images: File[];
    }>({
        title: '',
        description: '',
        ticket_price: '10.00',
        total_tickets: '100',
        draw_at: '',
        status: 'active',
        images: [],
    });

    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;

        const incoming = Array.from(newFiles).filter((f) =>
            f.type.startsWith('image/'),
        );
        const combined = [...form.data.images, ...incoming].slice(0, 6);

        form.setData('images', combined);

        // Generate object URLs for preview
        const newPreviews = combined.map((file) => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const removeImage = (index: number) => {
        const nextImages = form.data.images.filter((_, i) => i !== index);
        form.setData('images', nextImages);

        const nextPreviews = previews.filter((_, i) => i !== index);
        setPreviews(nextPreviews);
    };

    const submit = (statusToSave: 'draft' | 'active') => {
        form.setData('status', statusToSave);
        form.post(store.url(), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Create Lottery" />
            <div className="mx-auto flex max-w-4xl flex-col gap-6 pb-12">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="-ml-3 gap-1"
                    >
                        <Link href={lotteries()}>
                            <ArrowLeft className="size-4" />
                            Back to Lotteries
                        </Link>
                    </Button>
                </div>

                <PageHeader
                    title="Create New Lottery"
                    description="Configure raffle details, pricing, tickets cap, and scheduled draw date."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Raffle Information</CardTitle>
                        <CardDescription>
                            Enter the details of the item or prize being
                            raffled.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Raffle Title{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={form.data.title}
                                onChange={(e) =>
                                    form.setData('title', e.target.value)
                                }
                                placeholder="e.g. Sony PlayStation 5 Pro Console Bundle"
                                disabled={form.processing}
                            />
                            {form.errors.title && (
                                <p className="text-destructive text-sm">
                                    {form.errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description &amp; Specifications{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                                placeholder="Describe the item condition, accessories, warranty, and rules…"
                                rows={5}
                                disabled={form.processing}
                            />
                            {form.errors.description && (
                                <p className="text-destructive text-sm">
                                    {form.errors.description}
                                </p>
                            )}
                        </div>

                        {/* Pricing & Tickets Cap */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ticket_price">
                                    Ticket Price (USD){' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="ticket_price"
                                    type="number"
                                    step="0.01"
                                    min="0.50"
                                    value={form.data.ticket_price}
                                    onChange={(e) =>
                                        form.setData(
                                            'ticket_price',
                                            e.target.value,
                                        )
                                    }
                                    disabled={form.processing}
                                />
                                {form.errors.ticket_price && (
                                    <p className="text-destructive text-sm">
                                        {form.errors.ticket_price}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="total_tickets">
                                    Total Tickets Cap{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="total_tickets"
                                    type="number"
                                    min="2"
                                    value={form.data.total_tickets}
                                    onChange={(e) =>
                                        form.setData(
                                            'total_tickets',
                                            e.target.value,
                                        )
                                    }
                                    disabled={form.processing}
                                />
                                {form.errors.total_tickets && (
                                    <p className="text-destructive text-sm">
                                        {form.errors.total_tickets}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Draw Date Time */}
                        <div className="space-y-2">
                            <Label htmlFor="draw_at">
                                Scheduled Draw Date &amp; Time{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative max-w-sm">
                                <Calendar className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                <Input
                                    id="draw_at"
                                    type="datetime-local"
                                    value={form.data.draw_at}
                                    onChange={(e) =>
                                        form.setData('draw_at', e.target.value)
                                    }
                                    className="pl-9"
                                    disabled={form.processing}
                                />
                            </div>
                            {form.errors.draw_at && (
                                <p className="text-destructive text-sm">
                                    {form.errors.draw_at}
                                </p>
                            )}
                        </div>

                        {/* Image Gallery Upload */}
                        <div className="space-y-2">
                            <Label>Item Images (up to 6)</Label>
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
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragActive(false);
                                    handleFiles(e.dataTransfer.files);
                                }}
                                className={cn(
                                    'hover:bg-muted/50 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                                    dragActive && 'border-primary bg-primary/5',
                                )}
                            >
                                <UploadCloud className="text-muted-foreground size-8" />
                                <p className="text-sm font-medium">
                                    Drag &amp; drop raffle item photos, or{' '}
                                    <span className="text-primary">browse</span>
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    JPG, PNG, or WebP up to 5MB each
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp"
                                    className="sr-only"
                                    onChange={(e) =>
                                        handleFiles(e.target.files)
                                    }
                                />
                            </div>

                            {/* Preview Grid */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 pt-2 sm:grid-cols-6">
                                    {previews.map((src, index) => (
                                        <div
                                            key={index}
                                            className="group bg-muted relative aspect-square overflow-hidden rounded-lg border"
                                        >
                                            <img
                                                src={src}
                                                alt={`Upload preview ${index + 1}`}
                                                className="size-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(index)
                                                }
                                                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {form.errors.images && (
                                <p className="text-destructive text-sm">
                                    {form.errors.images}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 border-t pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => submit('draft')}
                                disabled={form.processing}
                            >
                                Save as Draft
                            </Button>
                            <Button
                                type="button"
                                onClick={() => submit('active')}
                                disabled={form.processing}
                            >
                                {form.processing
                                    ? 'Publishing…'
                                    : 'Publish & Activate'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminLotteriesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: dashboard(),
        },
        {
            title: 'Lotteries',
            href: lotteries(),
        },
        {
            title: 'Create',
            href: '#',
        },
    ],
};
