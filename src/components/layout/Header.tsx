'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, LayoutDashboard, BookOpen, Calendar, BarChart3, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-profit/20 to-profit/10 group-hover:from-profit/30 group-hover:to-profit/20 transition-all">
              <Brain className="h-6 w-6 text-profit-light" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-profit-light to-profit bg-clip-text text-transparent">TradeMind</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-profit/10 text-profit-light border border-profit/30'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-xl hover:bg-white/5">
                <Avatar className="h-12 w-12 rounded-xl">
                  <AvatarFallback className="bg-gradient-to-br from-profit/20 to-profit/10 text-profit-light rounded-xl font-bold text-lg">
                    {getInitials(profile?.full_name || null)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-card/95 backdrop-blur-lg border-white/10" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-base font-semibold leading-none">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
                    Capital: {profile?.current_capital?.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="cursor-pointer p-3">
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer p-3">
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleSignOut} className="text-loss-light cursor-pointer p-3">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
