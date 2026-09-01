<?php

namespace App\Notifications;

use App\Models\Lottery;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LotteryDrawResultNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public readonly Lottery $lottery,
        public readonly bool $isWinner,
        public readonly ?Ticket $winningTicket = null,
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
        $actionUrl = $this->isWinner
            ? route('app.lotteries.show', $this->lottery)
            : route('app.lotteries');

        $subject = $this->isWinner
            ? "🎉 Congratulations! You won the {$this->lottery->title} raffle!"
            : "Draw Result: {$this->lottery->title}";

        return (new MailMessage)
            ->subject($subject)
            ->view('mail.lottery-draw-result', [
                'lottery' => $this->lottery,
                'isWinner' => $this->isWinner,
                'winningTicket' => $this->winningTicket,
                'actionUrl' => $actionUrl,
            ]);
    }

    /**
     * Get the array representation of the notification stored in database.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $actionUrl = route('app.lotteries.show', $this->lottery);

        return [
            'type' => 'lottery.draw_result',
            'lottery_id' => $this->lottery->id,
            'lottery_title' => $this->lottery->title,
            'is_winner' => $this->isWinner,
            'winning_ticket_code' => $this->winningTicket?->ticket_code,
            'message' => $this->isWinner
                ? "🎉 የ'{$this->lottery->title}' ዕጣ አሸንፈዋል!"
                : "የ'{$this->lottery->title}' ዕጣ ማውጣት ተጠናቋል።",
            'url' => $actionUrl,
            'icon' => $this->isWinner ? 'trophy' : 'ticket',
        ];
    }
}
