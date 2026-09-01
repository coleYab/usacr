import { Form, Head, router, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { phone } from '@/routes/auth/telegram';
import { csrfHeaders } from '@/lib/csrf';
import { useTelegram } from '@/providers/telegram-provider';
import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile() {
    const { auth } = usePage<PageProps>().props;
    const { shareContact, initDataRaw } = useTelegram();
    const [phoneProcessing, setPhoneProcessing] = useState(false);

    const handleUpdatePhone = async () => {
        setPhoneProcessing(true);

        try {
            const contact = await shareContact();

            if (!contact) {
                toast.error('የስልክ ቁጥር መጋራት አልተሳካም።');

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

            toast.success('የስልክ ቁጥርዎ ተሻሽሏል።');
            router.reload({ only: ['auth'] });
        } catch {
            toast.error('ከተገናኘ አገልግሎት ጋር መገናኘት አልተቻለም።');
        } finally {
            setPhoneProcessing(false);
        }
    };

    return (
        <>
            <Head title="የመገለጫ ቅንብሮች" />

            <h1 className="sr-only">የመገለጫ ቅንብሮች</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="መገለጫ"
                    description="ስምዎን ያዘምኑ እና የስልክ ቁጥርዎን ያስተዳድሩ"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">ስም</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="ሙሉ ስም"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>የስልክ ቁጥር</Label>

                                <div className="flex items-center gap-2">
                                    <Input
                                        value={auth.user.phone ?? '—'}
                                        readOnly
                                        disabled
                                        className="bg-muted/40 mt-1 block w-full"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleUpdatePhone}
                                        disabled={phoneProcessing}
                                        className="mt-1 shrink-0"
                                    >
                                        {phoneProcessing && <Spinner />}
                                        አዘምን
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>የቴሌግራም መለያ</Label>

                                <Input
                                    value={
                                        auth.user.telegram_username
                                            ? `@${auth.user.telegram_username}`
                                            : (auth.user.telegram_id?.toString() ??
                                              '—')
                                    }
                                    readOnly
                                    disabled
                                    className="bg-muted/40 mt-1 block w-full"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    አስቀምጥ
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'የመገለጫ ቅንብሮች',
            href: edit(),
        },
    ],
};
