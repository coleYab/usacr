import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTelegram } from '@/providers/telegram-provider';
import { dashboard as appDashboard } from '@/routes/app';
import { dashboard as adminDashboard } from '@/routes/admin';
import type { Auth } from '@/types';

type PageProps = {
    auth?: Auth;
    telegram?: {
        bot_username?: string | null;
    };
};

type Props = {
    className?: string;
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
};

export function TelegramLoginButton({
    className,
    variant = 'default',
    size = 'default',
}: Props) {
    const { auth, telegram } = usePage<PageProps>().props;
    const { isTelegram } = useTelegram();

    if (auth?.user) {
        const href =
            auth.user.role === 'admin' ? adminDashboard() : appDashboard();

        return (
            <Button asChild size={size} className={className} variant={variant}>
                <Link href={href}>
                    ዳሽቦርድ ክፈት
                    <ArrowRight className="size-4" />
                </Link>
            </Button>
        );
    }

    if (isTelegram) {
        return (
            <Button
                className={className}
                variant={variant}
                size={size}
                disabled
            >
                <Spinner className="size-4" />
                በሂደት ላይ…
            </Button>
        );
    }

    const botUrl = telegram?.bot_username
        ? `https://t.me/${telegram.bot_username}`
        : null;

    return (
        <Button asChild className={className} variant={variant} size={size}>
            {botUrl ? (
                <a href={botUrl} target="_blank" rel="noopener noreferrer">
                    <Send className="size-4" />
                    በቴሌግራም ይክፈቱ
                </a>
            ) : (
                <Link href={appDashboard()}>
                    <Send className="size-4" />
                    ወደ ዳሽቦርድ ይሂዱ
                </Link>
            )}
        </Button>
    );
}
