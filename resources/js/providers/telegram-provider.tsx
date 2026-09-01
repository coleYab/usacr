import {
    init,
    miniAppReady,
    mountMiniApp,
    expandViewport,
    retrieveRawInitData,
    retrieveLaunchParams,
    requestContactComplete,
} from '@telegram-apps/sdk';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';

export type TelegramUser = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    language_code?: string;
    [key: string]: unknown;
};

type TelegramContactData = {
    raw: string;
    parsed: {
        contact: {
            user_id: number;
            phone_number: string;
            [key: string]: unknown;
        };
        [key: string]: unknown;
    };
};

type TelegramContextValue = {
    initDataRaw: string | undefined;
    tgUser: TelegramUser | undefined;
    isTelegram: boolean;
    phonePromptOpen: boolean;
    setPhonePromptOpen: (open: boolean) => void;
    shareContact: () => Promise<TelegramContactData | null>;
};

const TelegramContext = createContext<TelegramContextValue | null>(null);

export function TelegramProvider({ children }: PropsWithChildren) {
    const [initDataRaw, setInitDataRaw] = useState<string | undefined>(
        undefined,
    );
    const [tgUser, setTgUser] = useState<TelegramUser | undefined>(undefined);
    const [isTelegram, setIsTelegram] = useState(false);
    const [phonePromptOpen, setPhonePromptOpen] = useState(false);

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        try {
            cleanup = init();
        } catch {
            return;
        }

        try {
            void mountMiniApp();
            miniAppReady();
            expandViewport();
        } catch {
            // Some features aren't always available.
        }

        try {
            setInitDataRaw(retrieveRawInitData());
        } catch {
            setInitDataRaw(undefined);
        }

        try {
            const params = retrieveLaunchParams() as unknown as {
                tgWebAppData?: { user?: TelegramUser };
            };
            setTgUser(params.tgWebAppData?.user ?? undefined);
        } catch {
            setTgUser(undefined);
        }

        setIsTelegram(true);

        return cleanup;
    }, []);

    const shareContact =
        useCallback(async (): Promise<TelegramContactData | null> => {
            if (!requestContactComplete.isAvailable()) {
                return null;
            }

            try {
                const complete = await requestContactComplete();

                return complete as unknown as TelegramContactData;
            } catch {
                return null;
            }
        }, []);

    const value = useMemo<TelegramContextValue>(
        () => ({
            initDataRaw,
            tgUser,
            isTelegram,
            phonePromptOpen,
            setPhonePromptOpen,
            shareContact,
        }),
        [initDataRaw, tgUser, isTelegram, phonePromptOpen, shareContact],
    );

    return (
        <TelegramContext.Provider value={value}>
            {children}
        </TelegramContext.Provider>
    );
}

export function useTelegram(): TelegramContextValue {
    const context = useContext(TelegramContext);

    if (context === null) {
        throw new Error('useTelegram must be used within a TelegramProvider.');
    }

    return context;
}
