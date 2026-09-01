import { Monitor, Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();

    const icons = {
        light: Sun,
        dark: Moon,
        system: Monitor,
    };

    const Icon = icons[appearance];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('size-9', className)}
                    aria-label="ገጽታ ቀይር"
                >
                    <Icon className="size-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => updateAppearance('light')}>
                    <Sun className="mr-2 size-4" />
                    ብርሃን
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateAppearance('dark')}>
                    <Moon className="mr-2 size-4" />
                    ጨለማ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateAppearance('system')}>
                    <Monitor className="mr-2 size-4" />
                    ሲስተም
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
