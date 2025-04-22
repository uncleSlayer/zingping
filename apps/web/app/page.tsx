import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, UserPlus, Shield, Zap } from 'lucide-react';
import { headers } from 'next/headers';
import LogoutButton from './(pages)/chat/LogoutButton';
import Link from 'next/link';

const ChatAppHomepage = async () => {
  const email = (await headers()).get("x-userEmail")

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur mx-auto px-4">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap-2">
            <Link href='/' className="font-bold text-xl">ZingPing</Link>
          </div>
          <nav className="flex items-center gap-4">
            {email ? (
              <>
                <Link href="/friends" className="text-sm font-medium">Friends</Link>
                <Link href="/chat" className="text-sm font-medium">Chat</Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium">Login</Link>
                <Link href="/signup" className="text-sm font-medium">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="py-24 text-center md:py-32">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-12 w-12 text-indigo-500" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">ZingPing</h1>
          </div>
          <p className="mx-auto max-w-2xl mb-8 text-xl text-gray-600 dark:text-gray-400">
            Connect with friends instantly. Send messages, share moments, and stay in touch with ZingPing's real-time chat platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat" className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg shadow-lg">
              Start Chatting
            </Link> 
          </div>
        </section>

        {/* Features Cards */}
        <section className="py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-indigo-500" />
                  Instant Messaging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Send and receive messages in real-time. Stay connected with friends and family effortlessly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-6 w-6 text-indigo-500" />
                  Friend Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Easily add friends, manage requests, and organize your contacts all in one place.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-500" />
                  More Features Coming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Wait for more cooler updates like video and audio call.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mx-auto w-full">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-indigo-500" />
            <span className="text-lg font-medium">ZingPing</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 ZingPing. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};


export default ChatAppHomepage;
