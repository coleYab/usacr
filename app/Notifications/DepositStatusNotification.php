<?php

namespace App\Notifications;

use App\Models\Deposit;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DepositStatusNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly Deposit $deposit,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = $this->deposit->status->label();
        $amount = money($this->deposit->amount);

        return (new MailMessage)
            ->subject("Deposit {$status}: {$amount}")
            ->line("Your deposit of {$amount} has been marked as {$status}.")
            ->when($this->deposit->rejection_reason, fn ($mail) => $mail->line("Reason: {$this->deposit->rejection_reason}"))
            ->action('View Wallet', route('app.wallet'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $status = $this->deposit->status->label();
        $amount = money($this->deposit->amount);

        return [
            'type' => 'deposit.status',
            'deposit_id' => $this->deposit->id,
            'status' => $this->deposit->status->value,
            'amount' => $this->deposit->amount,
            'message' => "የ {$amount} ተቀማጭ ገንዘብዎ {$status} ሆኗል።",
            'url' => route('app.wallet'),
            'icon' => 'wallet',
        ];
    }
}
