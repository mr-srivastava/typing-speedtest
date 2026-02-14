import type { Metadata } from 'next';
import { Epilogue, Kanit } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/contexts/SessionContext';
import './globals.css';

import { cn } from '@/lib/utils';

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-epilogue',
});

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-kanit',
});

export const metadata: Metadata = {
  title: 'Octane Typing Speedtest',
  description:
    'Ready to dominate the keyboard? Our fun typing speed test will put your skills to the test.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          epilogue.variable,
          kanit.variable,
          epilogue.className,
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
