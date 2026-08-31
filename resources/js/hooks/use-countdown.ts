import { useEffect, useState } from 'react';

export type CountdownResult = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isExpired: boolean;
    isUrgent: boolean;
    isEndingSoon: boolean;
    formatted: string;
};

function calculateTimeLeft(targetDate: string | Date): CountdownResult {
    const target =
        typeof targetDate === 'string'
            ? new Date(targetDate).getTime()
            : targetDate.getTime();
    const now = Date.now();
    const diff = target - now;

    if (isNaN(target) || diff <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: 0,
            isExpired: true,
            isUrgent: false,
            isEndingSoon: false,
            formatted: 'Ended',
        };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const isUrgent = totalSeconds < 3600; // < 1 hour
    const isEndingSoon = totalSeconds < 86400; // < 24 hours

    let formatted = '';
    if (days > 0) {
        formatted = `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        formatted = `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        formatted = `${minutes}m ${seconds}s`;
    } else {
        formatted = `${seconds}s`;
    }

    return {
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        isExpired: false,
        isUrgent,
        isEndingSoon,
        formatted,
    };
}

export function useCountdown(targetDate: string | Date): CountdownResult {
    const [timeLeft, setTimeLeft] = useState<CountdownResult>(() =>
        calculateTimeLeft(targetDate),
    );

    useEffect(() => {
        setTimeLeft(calculateTimeLeft(targetDate));

        const interval = setInterval(() => {
            const result = calculateTimeLeft(targetDate);
            setTimeLeft(result);
            if (result.isExpired) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
}
