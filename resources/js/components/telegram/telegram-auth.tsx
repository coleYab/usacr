import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { TelegramAuthGateway } from '@/components/telegram/telegram-auth-gateway';
import { TelegramPhonePrompt } from '@/components/telegram/telegram-phone-prompt';
import { useTelegram } from '@/providers/telegram-provider';
import type { Auth } from '@/types';

type PageProps = {
    auth?: Auth;
};

export function TelegramAuth() {
    const { auth } = usePage<PageProps>().props;
    const { setPhonePromptOpen, isTelegram } = useTelegram();
    const needsPhone =
        isTelegram && auth?.user !== undefined && auth.user.phone === null;

    useEffect(() => {
        if (needsPhone) {
            setPhonePromptOpen(true);
        }
    }, [needsPhone, setPhonePromptOpen]);

    return (
        <>
            <TelegramAuthGateway />
            <TelegramPhonePrompt />
        </>
    );
}
