<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ $isWinner ? '🎉 You Won!' : 'Raffle Result' }} - Item Lottery</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #0c0a09;
            color: #f5f5f4;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 560px;
            margin: 0 auto;
            background-color: #1c1917;
            border: 1px solid #292524;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
        .header {
            padding: 32px 32px 24px;
            text-align: center;
            border-bottom: 1px solid #292524;
        }
        .brand {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: #10b981;
            margin-bottom: 8px;
        }
        .title {
            font-size: 24px;
            font-weight: 800;
            color: #fafaf9;
            margin: 0;
        }
        .content {
            padding: 32px;
        }
        .badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .badge-won {
            background-color: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .badge-lost {
            background-color: rgba(120, 113, 108, 0.2);
            color: #a8a29e;
            border: 1px solid rgba(120, 113, 108, 0.3);
        }
        .box {
            background-color: #292524;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
        }
        .box-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .box-row:last-child {
            margin-bottom: 0;
        }
        .box-label {
            color: #a8a29e;
        }
        .box-value {
            color: #f5f5f4;
            font-weight: 600;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .button {
            display: block;
            text-align: center;
            background-color: #10b981;
            color: #0c0a09;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 15px;
            margin: 28px 0 0;
        }
        .footer {
            padding: 20px 32px;
            text-align: center;
            border-top: 1px solid #292524;
            color: #78716c;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="brand">Item Lottery</div>
            <h1 class="title">{{ $isWinner ? '🎉 You Won the Raffle!' : 'Raffle Drawing Concluded' }}</h1>
        </div>
        <div class="content">
            @if ($isWinner)
                <div style="text-align: center;">
                    <div class="badge badge-won">🏆 WINNING TICKET HOLDER</div>
                </div>
                <p style="font-size: 16px; line-height: 1.6; color: #e7e5e4;">
                    Congratulations! Your ticket was randomly selected as the official winner of the <strong>{{ $lottery->title }}</strong> raffle.
                </p>
            @else
                <div style="text-align: center;">
                    <div class="badge badge-lost">Drawing Completed</div>
                </div>
                <p style="font-size: 15px; line-height: 1.6; color: #d6d3d1;">
                    The scheduled drawing for <strong>{{ $lottery->title }}</strong> has finished. Although your ticket was not drawn as the winner this time, thank you for participating!
                </p>
            @endif

            <div class="box">
                <div class="box-row">
                    <span class="box-label">Prize Item:</span>
                    <span class="box-value">{{ $lottery->title }}</span>
                </div>
                <div class="box-row">
                    <span class="box-label">Winning Ticket:</span>
                    <span class="box-value" style="color: #fbbf24;">{{ $winningTicket?->ticket_code ?? '—' }}</span>
                </div>
                <div class="box-row">
                    <span class="box-label">Draw Date:</span>
                    <span class="box-value">{{ $lottery->draw_at?->format('M j, Y g:i A') }}</span>
                </div>
            </div>

            @if ($isWinner)
                <p style="font-size: 13px; color: #a8a29e; line-height: 1.5;">
                    Our team will reach out to your registered email address with fulfillment instructions. You can also view your winning ticket in the app.
                </p>
                <a href="{{ $actionUrl }}" class="button" style="background-color: #f59e0b; color: #000;">View Winning Raffle</a>
            @else
                <a href="{{ $actionUrl }}" class="button">Explore Live Raffles</a>
            @endif
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Item Lottery. All rights reserved.
        </div>
    </div>
</body>
</html>
