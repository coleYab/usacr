import { TelegramAuthGateway } from '@/components/telegram/telegram-auth-gateway';
import { TelegramPhonePrompt } from '@/components/telegram/telegram-phone-prompt';

export function TelegramAuth() {
    return (
        <>
            <TelegramAuthGateway />
            <TelegramPhonePrompt />
        </>
    );
}
