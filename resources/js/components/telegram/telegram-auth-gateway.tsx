import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { useTelegram } from '@/providers/telegram-provider';
import { csrfHeaders } from '@/lib/csrf';
import { toast } from 'sonner';
import { telegram } from '@/routes/auth';
import type { Auth } from '@/types';

type TelegramAuthResponse = {
    user?: Auth['user'];
    is_admin?: boolean;
    needs_phone?: boolean;
    error?: string;
};

export function TelegramAuthGateway() {
    const { initDataRaw, setPhonePromptOpen, isTelegram } = useTelegram();
    const attempted = useRef(false);

    useEffect(() => {
        if (!isTelegram || !initDataRaw || attempted.current) {
            return;
        }

        attempted.current = true;

        void fetch(telegram.url(), {
            method: 'POST',
            headers: {
                ...csrfHeaders(),
                'X-Telegram-Init-Data': initDataRaw,
            },
            credentials: 'same-origin',
        })
            .then(async (response) => {
                if (!response.ok && response.status === 403) {
                    toast.error('መለያ አልተረጋገጠም። የቴሌግራም መረጃዎን ያረጋግጡ።');

                    return;
                }

                const payload = (await response
                    .json()
                    .catch(() => null)) as TelegramAuthResponse | null;

                if (payload?.error) {
                    toast.error(payload.error);

                    return;
                }

                if (payload?.needs_phone) {
                    setPhonePromptOpen(true);
                }

                router.reload({
                    only: ['auth', 'walletBalance', 'notifications'],
                });
            })
            .catch(() => {
                toast.error('ከተገናኘ አገልግሎት ጋር መገናኘት አልተቻለም።');
            });
    }, [initDataRaw, isTelegram, setPhonePromptOpen]);

    return null;
}
