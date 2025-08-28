"use client";

import Link from "next/link";
import { Music2, User as UserIcon, LogOut, LayoutDashboard, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Header() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0].substring(0, 2);
  };

  const navLinks = (
    <>
      {isAuthenticated && user?.role === 'admin' && (
        <Link href="/admin/dashboard" className="transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
          Admin
        </Link>
      )}
    </>
  );
  
  const authActions = (
     <div className="flex items-center gap-4">
      {loading ? (
        <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
      ) : isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.fullName} />
                <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
             {user.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">RhythmFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
            {authActions}
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="p-4">
                     <Link href="/" className="flex items-center gap-2 mb-8">
                        <Music2 className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg font-headline">RhythmFlow</span>
                    </Link>
                    <nav className="grid gap-4 text-lg font-medium">
                        {navLinks}
                        {!isAuthenticated && !loading && (
                            <>
                                <Link href="/login" className="transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Link href="/register" className="transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                            </>
                        )}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
        </div>

      </div>
    </header>
  );
}
