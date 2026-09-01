import { Form } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function DeleteUser() {
    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="መለያ ሰርዝ"
                description="መለያዎን እና ሁሉንም መረጃዎችዎን በቋሚነት ይሰርዙ"
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">ማስጠንቀቂያ</p>
                    <p className="text-sm">
                        እባክዎ በጥንቃቄ ይቀጥሉ፣ ይህ ተግባር ሊቀለበስ አይችልም።
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            መለያ ሰርዝ
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>እርግጠኛ ነዎት መለያዎን መሰረዝ ይፈልጋሉ?</DialogTitle>
                        <DialogDescription>
                            መለያዎ አንዴ ከተሰረዘ፣ ሁሉም ተዛማጅ መረጃዎች እና ሀብቶች በቋሚነት ይጠፋሉ።
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ processing }) => (
                                <DialogFooter className="gap-2 sm:justify-start">
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={processing}
                                        className="rounded-md"
                                    >
                                        {processing ? 'በሂደት ላይ…' : 'መለያ ሰርዝ'}
                                    </Button>
                                </DialogFooter>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
