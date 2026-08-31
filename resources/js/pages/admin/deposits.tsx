import { Head, router, useForm } from '@inertiajs/react';
import { Check, Eye, ListChecks, X } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { DepositStatusBadge } from '@/components/deposit-status-badge';
import { PageHeader } from '@/components/page-header';
import { ReceiptDialog } from '@/components/receipt-dialog';
import { toDataTablePagination } from '@/lib/pagination';
import { navigate } from '@/lib/navigate';
import { dashboard, deposits } from '@/routes/admin';
import { approve, reject } from '@/routes/admin/deposits';
import type { DepositRow, Paginated } from '@/types';

type DepositSet = Paginated<DepositRow>;

type Props = {
    counts: {
        pending: number;
        approved: number;
        rejected: number;
    };
    deposits: {
        pending: DepositSet;
        approved: DepositSet;
        rejected: DepositSet;
    };
};

function userCell(d: DepositRow) {
    return (
        <div>
            <p className="font-medium">{d.user?.name}</p>
            <p className="text-muted-foreground text-xs">{d.user?.email}</p>
        </div>
    );
}

export default function AdminDeposits({ counts, deposits: sets }: Props) {
    const [tab, setTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const searchTab = new URLSearchParams(window.location.search).get(
                'tab',
            );
            if (
                searchTab &&
                ['pending', 'approved', 'rejected'].includes(searchTab)
            ) {
                return searchTab;
            }
        }
        return 'pending';
    });
    const [approving, setApproving] = useState<DepositRow | null>(null);
    const [rejecting, setRejecting] = useState<DepositRow | null>(null);
    const [receipt, setReceipt] = useState<DepositRow | null>(null);

    const rejectForm = useForm<{ reason: string }>({ reason: '' });

    const nav = (params: Record<string, string | number | undefined>) =>
        navigate(deposits.url(), params);

    const runAction = (action: 'approve' | 'reject', row: DepositRow) => {
        if (action === 'approve') {
            setApproving(row);
        } else {
            rejectForm.reset();
            setRejecting(row);
        }
    };

    const confirmApprove = () => {
        if (!approving) {
            return;
        }
        router.post(
            approve.url({ deposit: approving.id }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => setApproving(null),
            },
        );
    };

    const confirmReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejecting) {
            return;
        }
        rejectForm.post(reject.url({ deposit: rejecting.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setRejecting(null);
                rejectForm.reset();
            },
            onError: () => undefined,
        });
    };

    const columns = (withActions: boolean): DataTableColumn<DepositRow>[] => [
        {
            header: 'User',
            cell: userCell,
        },
        {
            header: 'Amount',
            cell: (d) => (
                <span className="font-mono font-medium">
                    {d.amount_formatted}
                </span>
            ),
        },
        {
            header: 'Submitted',
            cell: (d) => (
                <div>
                    <p className="font-medium">{d.created_at_formatted}</p>
                    <p className="text-muted-foreground text-xs">
                        {d.created_at_diff}
                    </p>
                </div>
            ),
        },
        {
            header: 'Status',
            cell: (d) => (
                <DepositStatusBadge status={d.status} label={d.status_label} />
            ),
        },
        {
            header: 'Receipt',
            cell: (d) =>
                d.receipt_url ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReceipt(d)}
                    >
                        <Eye className="size-3.5" />
                        View
                    </Button>
                ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                ),
        },
        ...(withActions
            ? [
                  {
                      header: 'Actions' as const,
                      className: 'w-32',
                      cell: (d: DepositRow) => (
                          <div className="flex items-center gap-1">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => runAction('approve', d)}
                              >
                                  <Check className="text-primary size-3.5" />
                                  Approve
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => runAction('reject', d)}
                              >
                                  <X className="text-destructive size-3.5" />
                              </Button>
                          </div>
                      ),
                  },
              ]
            : [
                  {
                      header: 'Rejection Reason' as const,
                      className: 'max-w-xs',
                      cell: (d: DepositRow) =>
                          d.status === 'rejected' && d.rejection_reason ? (
                              <span className="text-destructive line-clamp-2 text-xs">
                                  {d.rejection_reason}
                              </span>
                          ) : (
                              <span className="text-muted-foreground text-xs">
                                  —
                              </span>
                          ),
                  },
              ]),
    ];

    return (
        <>
            <Head title="Deposits" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Deposits"
                    description="Review deposit requests and credit wallets on approval."
                />

                <Tabs value={tab} onValueChange={(v) => setTab(v)}>
                    <TabsList>
                        <TabsTrigger value="pending">
                            Pending ({counts.pending})
                        </TabsTrigger>
                        <TabsTrigger value="approved">
                            Approved ({counts.approved})
                        </TabsTrigger>
                        <TabsTrigger value="rejected">
                            Rejected ({counts.rejected})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-4 pt-4">
                        <DataTable
                            columns={columns(true)}
                            rows={sets.pending.data}
                            keyExtractor={(d) => d.id}
                            emptyIcon={ListChecks}
                            emptyTitle="No pending deposits"
                            emptyDescription="New deposit requests will appear here for review."
                            pagination={toDataTablePagination(
                                sets.pending.pagination,
                                (page) => nav({ tab: 'pending', page }),
                            )}
                        />
                    </TabsContent>

                    <TabsContent value="approved" className="space-y-4 pt-4">
                        <DataTable
                            columns={columns(false)}
                            rows={sets.approved.data}
                            keyExtractor={(d) => d.id}
                            emptyIcon={ListChecks}
                            emptyTitle="No approved deposits yet"
                            emptyDescription="Approved and credited deposits will appear here."
                            pagination={toDataTablePagination(
                                sets.approved.pagination,
                                (page) => nav({ tab: 'approved', page }),
                            )}
                        />
                    </TabsContent>

                    <TabsContent value="rejected" className="space-y-4 pt-4">
                        <DataTable
                            columns={columns(false)}
                            rows={sets.rejected.data}
                            keyExtractor={(d) => d.id}
                            emptyIcon={ListChecks}
                            emptyTitle="No rejected deposits"
                            emptyDescription="Rejected deposits will appear here with their reason."
                            pagination={toDataTablePagination(
                                sets.rejected.pagination,
                                (page) => nav({ tab: 'rejected', page }),
                            )}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <AlertDialog
                open={Boolean(approving)}
                onOpenChange={(open) => !open && setApproving(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Approve this deposit?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will credit the user's wallet with{' '}
                            {approving?.amount_formatted} and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setApproving(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmApprove}>
                            Approve &amp; Credit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog
                open={Boolean(rejecting)}
                onOpenChange={(open) => !open && setRejecting(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={confirmReject}>
                        <DialogHeader>
                            <DialogTitle>Reject deposit</DialogTitle>
                            <DialogDescription>
                                Provide the reason shown to the user. No wallet
                                change is made.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-4">
                            <Label htmlFor="reason">Rejection reason</Label>
                            <Textarea
                                id="reason"
                                value={rejectForm.data.reason}
                                onChange={(e) =>
                                    rejectForm.setData('reason', e.target.value)
                                }
                                placeholder="e.g. Receipt is unreadable or the payment was not received."
                                rows={4}
                            />
                            {rejectForm.errors.reason && (
                                <p className="text-destructive text-sm">
                                    {rejectForm.errors.reason}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setRejecting(null)}
                                disabled={rejectForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={
                                    rejectForm.processing ||
                                    rejectForm.data.reason.length < 10
                                }
                            >
                                {rejectForm.processing
                                    ? 'Rejecting…'
                                    : 'Reject Deposit'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {receipt && (
                <ReceiptDialog
                    deposit={receipt}
                    open={Boolean(receipt)}
                    onOpenChange={(open) => !open && setReceipt(null)}
                />
            )}
        </>
    );
}

AdminDeposits.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: dashboard(),
        },
        {
            title: 'Deposits',
            href: deposits(),
        },
    ],
};
