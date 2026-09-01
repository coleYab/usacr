import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="የገጽታ ቅንብሮች" />

            <h1 className="sr-only">የገጽታ ቅንብሮች</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="የገጽታ ቅንብሮች"
                    description="የመለያዎን የገጽታ ቅንብሮች ያዘምኑ"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'የገጽታ ቅንብሮች',
            href: editAppearance(),
        },
    ],
};
