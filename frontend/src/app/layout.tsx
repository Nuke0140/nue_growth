import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import AuthProvider from '@/providers/auth-provider';
<<<<<<< HEAD
import { ToastContainer } from '@/hooks/use-action-feedback.tsx';
=======
import { AppSystemProviders } from '@/app-system/providers';
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'NueEra Growth OS',
  description: 'Run Your Entire Business From One System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AppSystemProviders>
              {children}
            </AppSystemProviders>
          </AuthProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
