"use client";

import { useRouter, usePathname } from "next/navigation"; // Added usePathname
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
import { LogOut, User } from "lucide-react";
import { API_HOST } from "@/config/host";
import Link from "next/link";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_HOST}/auth/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        router.push("/login");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-7xl mx-auto">
        <nav className="border-b bg-background">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-lg font-semibold">
                ZingPing
              </Link>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              {pathname === "/chat" && (
                <Button
                  variant="ghost"
                  onClick={() => router.push("/friends")}
                  className="text-sm font-medium cursor-pointer"
                >
                  Friends
                </Button>
              )}
              {pathname === "/friends" && (
                <Button
                  variant="ghost"
                  onClick={() => router.push("/chat")}
                  className="text-sm font-medium cursor-pointer"
                >
                  Chat
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src="/avatars/01.png" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
