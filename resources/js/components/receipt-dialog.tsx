import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink, FileText } from 'lucide-react';
import type { DepositRow } from '@/types';

function isImage(url: string | null): boolean {
    return Boolean(url && /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url));
}

export function ReceiptDialog({
    deposit,
    open,
    onOpenChange,
}: {
    deposit: DepositRow;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { receipt_url: url, user, amount_formatted: amount } = deposit;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Receipt {user ? `for ${user.name}` : ''} — {amount}
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-auto rounded-lg border">
                    {url ? (
                        isImage(url) ? (
                            <img
                                src={url}
                                alt="Deposit receipt"
                                className="w-full object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-4 p-10 text-center">
                                <FileText className="text-muted-foreground size-10" />
                                <p className="text-muted-foreground text-sm">
                                    This is a PDF receipt.
                                </p>
                                <Button asChild>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <ExternalLink className="size-4" />
                                        Open PDF
                                    </a>
                                </Button>
                            </div>
                        )
                    ) : (
                        <p className="text-muted-foreground p-10 text-sm">
                            No receipt was uploaded.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
