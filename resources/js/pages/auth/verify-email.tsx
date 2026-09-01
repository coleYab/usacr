// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="ኢሜይል ማረጋገጫ" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    በምዝገባ ወቅት ወዳስገቡት የኢሜይል አድራሻ አዲስ የማረጋገጫ ሊንክ ተልኳል።
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            የማረጋገጫ ኢሜይል እንደገና ላክ
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            ውጣ
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'ኢሜይል ማረጋገጫ',
    description: 'እባክዎ ወደ ኢሜይልዎ የላክነውን ሊንክ በመጫን የኢሜይል አድራሻዎን ያረጋግጡ።',
};
