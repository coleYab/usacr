import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Phone } from 'lucide-react';
import { useTelegram } from '@/providers/telegram-provider';
import { csrfHeaders } from '@/lib/csrf';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { phone } from '@/routes/auth/telegram';

type Props = {
    onSaved?: () => void;
};

export function TelegramPhonePrompt({ onSaved }: Props) {
    const { phonePromptOpen, setPhonePromptOpen, shareContact, initDataRaw } =
        useTelegram();
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!phonePromptOpen) {
            setProcessing(false);
        }
    }, [phonePromptOpen]);

    const handleShare = async () => {
        setProcessing(true);

        try {
            const contact = await shareContact();

            if (!contact) {
                toast.error('የስልክ ቁጥር መጋራት አልተሳካም። እንደገና ይሞክሩ።');

                return;
            }

            const response = await fetch(phone.url(), {
                method: 'POST',
                headers: csrfHeaders({
                    'X-Telegram-Init-Data': initDataRaw,
                }),
                credentials: 'same-origin',
                body: JSON.stringify({ contact: contact.raw }),
            });

            if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as {
                    error?: string;
                } | null;
                toast.error(payload?.error ?? 'የስልክ ቁጥር ቆጣቢ አልተሳካም።');

                return;
            }

            setPhonePromptOpen(false);
            toast.success('የስልክ ቁጥርዎ ተመዝግቧል።');
            router.reload({ only: ['auth'] });
            onSaved?.();
        } catch {
            toast.error('ከተገናኘ አገልግሎት ጋር መገናኘት አልተቻለም።');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={phonePromptOpen} onOpenChange={setPhonePromptOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>የስልክ ቁጥርዎን ያጋሩ</DialogTitle>
                    <DialogDescription>
                        ለውስጥ ማስገባት (መዋጮ) እና ለደንበኛ ድጋፍ የስልክ ቁጥርዎን ከቴሌግራም እንፈልጋለን።
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        onClick={handleShare}
                        disabled={processing}
                        className="w-full"
                    >
                        {processing ? (
                            <Spinner />
                        ) : (
                            <Phone className="size-4" />
                        )}
                        የስልክ ቁጥር ከቴሌግራም ያግኙ
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
