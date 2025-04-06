import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { headers } from 'next/headers';
import axios from 'axios';
import LogoutButton from './(pages)/chat/LogoutButton';

const ChatAppHomepage = async () => {

  const email = (await headers()).get("x-userEmail")

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur mx-auto">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-indigo-500" />
            <span className="font-bold">ChatBuddy</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Features</Button>
            <Button variant="ghost" size="sm">About</Button>
            {
              email ? <LogoutButton /> : <Button variant="outline" size="sm">Sign in</Button>
            }
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 mx-auto">
        <section className="container flex flex-col items-center justify-center py-24 text-center md:py-32">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-10 w-10 text-indigo-500" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">ChatBuddy</h1>
          </div>
          <p className="max-w-md mb-8 text-lg text-gray-600 dark:text-gray-400">
            Simple, secure messaging for everyone. Connect with friends in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </section>

        {/* Features Cards */}
        <section className="container py-16">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect instantly with friends and family with our lightning-fast messaging.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  End-to-end encryption keeps your conversations private and secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simple Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Clean, intuitive interface that focuses on what matters - your conversations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mx-auto">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-medium">ChatBuddy</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 ChatBuddy. A hobby project.</p>
        </div>
      </footer>
    </div>
  );
};

export default ChatAppHomepage;