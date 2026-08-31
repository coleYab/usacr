import { useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { status as updateStatusRoute } from '@/routes/admin/users';
import type { UserStatus } from '@/types';

type ModerateUserDialogProps = {
    user: {
        id: number;
        name: string;
        email: string;
        status: UserStatus;
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialTargetStatus?: UserStatus;
};

export function ModerateUserDialog({
    user,
    open,
    onOpenChange,
    initialTargetStatus = 'suspended',
}: ModerateUserDialogProps) {
    const [targetStatus, setTargetStatus] =
        useState<UserStatus>(initialTargetStatus);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            status: initialTargetStatus,
            reason: '',
        });

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
        onOpenChange(isOpen);
    };

    const handleSelectStatus = (status: UserStatus) => {
        setTargetStatus(status);
        setData('status', status);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            return;
        }

        post(updateStatusRoute.url({ user: user.id }), {
            preserveScroll: true,
            onSuccess: () => {
                handleOpenChange(false);
            },
        });
    };

    if (!user) {
        return null;
    }

    const isDestructive =
        targetStatus === 'banned' || targetStatus === 'suspended';

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2">
                            {targetStatus === 'banned' && (
                                <ShieldAlert className="text-destructive size-5 shrink-0" />
                            )}
                            {targetStatus === 'suspended' && (
                                <AlertTriangle className="size-5 shrink-0 text-amber-500" />
                            )}
                            {targetStatus === 'active' && (
                                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                            )}
                            <AlertDialogTitle>
                                {targetStatus === 'banned' &&
                                    'Ban User Account'}
                                {targetStatus === 'suspended' &&
                                    'Suspend User Account'}
                                {targetStatus === 'active' &&
                                    'Reactivate User Account'}
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription>
                            Target User:{' '}
                            <span className="text-foreground font-medium">
                                {user.name}
                            </span>{' '}
                            ({user.email}). Current status is{' '}
                            <span className="text-xs font-semibold uppercase">
                                {user.status}
                            </span>
                            .
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Status Selection Buttons */}
                    <div className="space-y-1.5">
                        <Label>Select Action</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                type="button"
                                variant={
                                    targetStatus === 'active'
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => handleSelectStatus('active')}
                                className={
                                    targetStatus === 'active'
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : ''
                                }
                            >
                                Active
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    targetStatus === 'suspended'
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => handleSelectStatus('suspended')}
                                className={
                                    targetStatus === 'suspended'
                                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                                        : ''
                                }
                            >
                                Suspend
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    targetStatus === 'banned'
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => handleSelectStatus('banned')}
                                className={
                                    targetStatus === 'banned'
                                        ? 'bg-destructive hover:bg-destructive/90 text-white'
                                        : ''
                                }
                            >
                                Ban
                            </Button>
                        </div>
                    </div>

                    {/* Reason input for suspend or ban */}
                    {targetStatus !== 'active' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="moderation-reason">
                                Reason for {targetStatus}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="moderation-reason"
                                placeholder={`State why this user is being ${targetStatus}...`}
                                value={data.reason}
                                onChange={(e) =>
                                    setData('reason', e.target.value)
                                }
                                required
                            />
                            {errors.reason && (
                                <p className="text-destructive text-xs">
                                    {errors.reason}
                                </p>
                            )}
                        </div>
                    )}

                    <AlertDialogFooter className="pt-2">
                        <AlertDialogCancel type="button" disabled={processing}>
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                (targetStatus !== 'active' &&
                                    data.reason.trim().length < 3)
                            }
                            variant={isDestructive ? 'destructive' : 'default'}
                        >
                            {processing ? 'Processing...' : 'Confirm Action'}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
