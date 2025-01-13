import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ClientProvider from '@/components/ClientProvider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'QPart',
  description: 'Якісні верстати з Європи',
  // viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProvider>{children}</ClientProvider> {/* Use ClientProvider here */}
      </body>
    </html>
  );
}
